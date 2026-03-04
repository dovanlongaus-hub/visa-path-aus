import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, category, content } = await req.json();

    if (!title || !category || !content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `Bạn là AI phân tích feedback ứng dụng di trú Úc.

FEEDBACK NHẬN ĐƯỢC:
- Tiêu đề: ${title}
- Loại: ${category}
- Nội dung: ${content}

NHIỆM VỤ:
Phân tích feedback và trả về JSON:
{
  "is_valuable": true/false,
  "reason": "Lý do tại sao feedback này có/không có giá trị",
  "is_feature_request": true/false,
  "estimated_effort": "small|medium|large",
  "impact_score": 0-100,
  "suggested_version": "v2.1|v2.2|v3.0 (dựa trên độ phức tạp)",
  "implementation_notes": ["Ghi chú 1", "Ghi chú 2"],
  "potential_users_benefit": "Ước tính bao nhiêu phần trăm người dùng sẽ hưởng lợi",
  "recommendation": "Approve|Review|Reject (với lý do)"
}

Hãy đánh giá một cách khách quan. Các feedback về cải thiện UX, tính năng mới hữu ích cho di trú, hoặc khắc phục lỗi thường nên được phê duyệt.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          is_valuable: { type: 'boolean' },
          reason: { type: 'string' },
          is_feature_request: { type: 'boolean' },
          estimated_effort: { type: 'string' },
          impact_score: { type: 'number' },
          suggested_version: { type: 'string' },
          implementation_notes: { type: 'array', items: { type: 'string' } },
          potential_users_benefit: { type: 'string' },
          recommendation: { type: 'string' },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});