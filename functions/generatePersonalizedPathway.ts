import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cvData } = await req.json();
    
    // Fetch all articles and documents for recommendations
    const articles = await base44.asServiceRole.entities.Article.list('-created_date', 100).catch(() => []);
    const documents = await base44.asServiceRole.entities.Document.list('-created_date', 100).catch(() => []);

    if (!cvData) {
      return Response.json({ error: 'Missing CV data' }, { status: 400 });
    }

    const profileContext = `
CV ANALYSIS DATA:
- Full Name: ${cvData.full_name || 'N/A'}
- Experience: ${cvData.work_experience?.map(e => `${e.position} at ${e.company} (${e.duration})`).join('; ') || 'Not provided'}
- Education: ${cvData.education_history?.map(e => `${e.degree} in ${e.field} from ${e.institution}`).join('; ') || 'Not provided'}
- Skills: ${cvData.skills?.join(', ') || 'Not provided'}
- Certifications: ${cvData.certifications?.join(', ') || 'None'}
- Languages: ${cvData.languages?.join(', ') || 'Not provided'}
`;

    const articlesContext = articles.map(a => `- "${a.title}" (${a.category}): ${a.summary || a.content?.substring(0, 100)}`).join('\n');
    const documentsContext = documents.map(d => `- "${d.title}" (${d.category}, visa: ${d.visa_code || 'all'})`).join('\n');

    const prompt = `Bạn là chuyên gia tư vấn di trú Úc. Phân tích CV người dùng và tạo lộ trình di trú cá nhân chi tiết kèm theo gợi ý tài liệu và bài viết.

${profileContext}

AVAILABLE ARTICLES:
${articlesContext}

AVAILABLE DOCUMENTS:
${documentsContext}

NHIỆM VỤ:
Dựa trên CV, hãy:
1. Xác định loại visa phù hợp nhất (189, 190, 485, 482, 858)
2. Tính điểm EOI ước tính dựa trên thông tin CV
3. Đánh giá điểm mạnh & yếu
4. Cung cấp lộ trình cụ thể (timeline & bước)
5. Các hành động ngay lập tức cần làm
6. Gợi ý bài viết và tài liệu liên quan cho từng giai đoạn

ĐỊNH DẠNG JSON TRẢ VỀ:
{
  "recommendation_summary": "Tóm tắt đề xuất lộ trình (2-3 câu)",
  "suitable_visas": [
    {
      "visa_code": "189",
      "visa_name": "Skilled Independent",
      "suitability_score": 85,
      "estimated_timeline": "6-12 tháng",
      "key_requirements": ["Requirement 1", "Requirement 2"],
      "success_probability": "Cao"
    }
  ],
  "eoi_estimate": {
    "estimated_points": 75,
    "breakdown": [
      { "factor": "Age", "points": 30 },
      { "factor": "English", "points": 20 },
      { "factor": "Work Experience", "points": 15 },
      { "factor": "Education", "points": 10 }
    ]
  },
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "roadmap": {
    "immediate_actions": [
      { "action": "Action 1", "timeline": "1-2 tuần", "importance": "critical" },
      { "action": "Action 2", "timeline": "1 tháng", "importance": "high" }
    ],
    "phase_1": {
      "title": "Chuẩn bị (1-2 tháng)",
      "steps": ["Step 1", "Step 2"]
    },
    "phase_2": {
      "title": "Nộp EOI (2-3 tháng)",
      "steps": ["Step 1", "Step 2"]
    },
    "phase_3": {
      "title": "Nhận Invite & Nộp (3-6 tháng)",
      "steps": ["Step 1", "Step 2"]
    }
  },
  "personalized_tips": [
    "Tip 1 dựa trên profile",
    "Tip 2 dựa trên profile"
  ],
  "questions_to_clarify": ["Question 1", "Question 2"]
}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          recommendation_summary: { type: 'string' },
          suitable_visas: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                visa_code: { type: 'string' },
                visa_name: { type: 'string' },
                suitability_score: { type: 'number' },
                estimated_timeline: { type: 'string' },
                key_requirements: { type: 'array', items: { type: 'string' } },
                success_probability: { type: 'string' },
              },
            },
          },
          eoi_estimate: {
            type: 'object',
            properties: {
              estimated_points: { type: 'number' },
              breakdown: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    factor: { type: 'string' },
                    points: { type: 'number' },
                  },
                },
              },
            },
          },
          strengths: { type: 'array', items: { type: 'string' } },
          weaknesses: { type: 'array', items: { type: 'string' } },
          roadmap: {
            type: 'object',
            properties: {
              immediate_actions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    action: { type: 'string' },
                    timeline: { type: 'string' },
                    importance: { type: 'string' },
                  },
                },
              },
              phase_1: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  steps: { type: 'array', items: { type: 'string' } },
                  recommended_articles: { type: 'array', items: { type: 'string' } },
                  recommended_documents: { type: 'array', items: { type: 'string' } },
                },
              },
              phase_2: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  steps: { type: 'array', items: { type: 'string' } },
                  recommended_articles: { type: 'array', items: { type: 'string' } },
                  recommended_documents: { type: 'array', items: { type: 'string' } },
                },
              },
              phase_3: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  steps: { type: 'array', items: { type: 'string' } },
                  recommended_articles: { type: 'array', items: { type: 'string' } },
                  recommended_documents: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
          personalized_tips: { type: 'array', items: { type: 'string' } },
          questions_to_clarify: { type: 'array', items: { type: 'string' } },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});