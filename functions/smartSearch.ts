import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query } = await req.json();

    if (!query || query.trim().length === 0) {
      return Response.json({ error: 'Query cannot be empty' }, { status: 400 });
    }

    // Fetch all searchable content in parallel
    const [articles, documents, faqs, feedback] = await Promise.all([
      base44.asServiceRole.entities.Article.filter({ status: 'published' }, '-view_count', 100).catch(() => []),
      base44.asServiceRole.entities.Document.list('-download_count', 100).catch(() => []),
      base44.asServiceRole.entities.FAQ.list('-order', 100).catch(() => []),
      base44.asServiceRole.entities.Feedback.filter({ status: 'approved' }, '-created_date', 50).catch(() => []),
    ]);

    // Build search context
    const articlesContext = articles.map(a => `Article: "${a.title}" (${a.category}): ${a.summary || a.content?.substring(0, 150)}`).join('\n');
    const documentsContext = documents.map(d => `Document: "${d.title}" (${d.category}, ${d.file_type}): ${d.description || ''}`).join('\n');
    const faqsContext = faqs.map(f => `FAQ: "${f.question}": ${f.answer?.substring(0, 150)}`).join('\n');
    const feedbackContext = feedback.map(f => `User Feedback: "${f.title}" - ${f.content?.substring(0, 150)}`).join('\n');

    const prompt = `Bạn là chuyên gia tư vấn di trú Úc. Phân tích câu hỏi tìm kiếm bằng ngôn ngữ tự nhiên và tìm các kết quả liên quan nhất từ knowledge base.

NGƯỜI DÙNG HỎI: "${query}"

KNOWLEDGE BASE:

ARTICLES:
${articlesContext}

DOCUMENTS:
${documentsContext}

FAQs:
${faqsContext}

USER FEEDBACK & DISCUSSIONS:
${feedbackContext}

NHIỆM VỤ:
1. Phân tích ý định của người dùng (tìm kiếm visa nào? kỹ năng gì? tài liệu gì?)
2. Hiểu ngữ cảnh di trú (visa codes, visa stages, occupation codes, requirements, etc.)
3. Tìm các tài liệu, bài viết, FAQ liên quan nhất
4. Sắp xếp theo độ liên quan từ cao đến thấp
5. Nếu câu hỏi không có kết quả chính xác, gợi ý những hướng tìm kiếm tương tự

ĐỊNH DẠNG JSON TRẢ VỀ:
{
  "query_analysis": "Phân tích ý định tìm kiếm của người dùng",
  "search_intent": "visa_information / document_request / general_question / job_opportunities / skill_improvement",
  "results": [
    {
      "type": "article",
      "title": "Title",
      "category": "Category",
      "summary": "Summary or relevant excerpt",
      "relevance_score": 95,
      "reason": "Tại sao kết quả này phù hợp"
    },
    {
      "type": "document",
      "title": "Title",
      "category": "Category",
      "file_type": "PDF/DOCX/etc",
      "relevance_score": 90,
      "reason": "Tại sao kết quả này phù hợp"
    },
    {
      "type": "faq",
      "question": "Question",
      "answer_preview": "First part of answer",
      "relevance_score": 85,
      "reason": "Tại sao kết quả này phù hợp"
    }
  ],
  "related_searches": [
    "Related search suggestion 1",
    "Related search suggestion 2"
  ],
  "tips": [
    "Gợi ý hoặc lưu ý liên quan đến tìm kiếm"
  ]
}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          query_analysis: { type: 'string' },
          search_intent: { type: 'string' },
          results: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                title: { type: 'string' },
                category: { type: 'string' },
                summary: { type: 'string' },
                relevance_score: { type: 'number' },
                reason: { type: 'string' },
              },
            },
          },
          related_searches: { type: 'array', items: { type: 'string' } },
          tips: { type: 'array', items: { type: 'string' } },
        },
      },
    });

    // Log search for analytics
    try {
      await base44.asServiceRole.entities.ChatMessage.create({
        role: 'search',
        content: query,
        session_id: `search_${Date.now()}`,
      });
    } catch (e) {
      // Ignore logging errors
    }

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});