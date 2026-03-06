import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('github');

    const body = await req.json().catch(() => ({}));
    const owner = body.owner || 'dovanlongaus';
    const repo = body.repo || 'dovanlongaus-hub';
    const branch = body.branch || 'main';
    const message = body.message || `Update: ${new Date().toISOString()}`;
    const files = body.files || []; // [{ path, content }]

    if (!files.length) {
      return Response.json({ error: 'No files provided' }, { status: 400 });
    }

    const baseHeaders = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    // 1. Check if branch exists
    const branchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches/${branch}`, {
      headers: baseHeaders,
    });

    let latestCommitSha = null;
    let baseTreeSha = null;
    let isNewRepo = false;

    if (branchRes.ok) {
      const branchData = await branchRes.json();
      latestCommitSha = branchData.commit.sha;
      baseTreeSha = branchData.commit.commit.tree.sha;
    } else {
      // Repo is empty - we'll create the initial commit
      isNewRepo = true;
    }

    // 2. Create blobs for each file
    const blobShas = await Promise.all(files.map(async (file) => {
      const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/blobs`, {
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify({ content: file.content, encoding: 'utf-8' }),
      });
      const blob = await blobRes.json();
      return { path: file.path, sha: blob.sha, mode: '100644', type: 'blob' };
    }));

    // 3. Create new tree
    const treeBody = isNewRepo
      ? { tree: blobShas }
      : { base_tree: baseTreeSha, tree: blobShas };

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify(treeBody),
    });
    const treeData = await treeRes.json();

    // 4. Create commit
    const commitBody = {
      message,
      tree: treeData.sha,
      parents: isNewRepo ? [] : [latestCommitSha],
    };

    const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify(commitBody),
    });
    const commitData = await commitRes.json();

    // 5. Create or update branch ref
    let refData;
    if (isNewRepo) {
      // Create new ref for empty repo
      const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
        method: 'POST',
        headers: baseHeaders,
        body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: commitData.sha }),
      });
      refData = await refRes.json();
    } else {
      const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
        method: 'PATCH',
        headers: baseHeaders,
        body: JSON.stringify({ sha: commitData.sha, force: false }),
      });
      refData = await refRes.json();
    }

    return Response.json({
      success: true,
      commit: commitData.sha,
      url: `https://github.com/${owner}/${repo}/commit/${commitData.sha}`,
      message,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});