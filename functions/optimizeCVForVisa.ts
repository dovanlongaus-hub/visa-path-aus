import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cvData, visaCode, visaName } = await req.json();

    if (!cvData || !visaCode) {
      return Response.json({ error: 'Missing cvData or visaCode' }, { status: 400 });
    }

    const visaRequirements = {
      '189': 'Skilled Independent – yêu cầu: độc lập, không phụ thuộc tiểu bang, điểm EOI cao, kinh nghiệm chuyên môn sâu',
      '190': 'State Nominated – yêu cầu: phù hợp với danh sách ngành của tiểu bang, kinh nghiệm ở lĩnh vực cần thiết, kỹ năng chuyên sâu',
      '491': 'Regional Sponsored – yêu cầu: sẵn sàng ở vùng, kỹ năng phù hợp với nhu cầu địa phương, có supporter từ vùng',
      '485': 'Temporary Graduate – yêu cầu: vừa tốt nghiệp tại Úc, tại Úc trong thời gian học, kỹ năng mới nhất',
      '482': 'Employer Sponsored – yêu cầu: đáp ứng yêu cầu của nhà tuyển dụng, kinh nghiệm thực tế, kỹ năng chuyên biệt',
      '858': 'National Innovation – yêu cầu: những thành tựu nổi bật, đóng góp vào lĩnh vực, tiềm năng cao',
    };

    const prompt = `Bạn là chuyên gia CV Australia chuyên tối ưu hóa CV cho visa di trú.

THÔNG TIN CV HIỆN TẠI:
- Tên: ${cvData.full_name || 'N/A'}
- ANZSCO: ${cvData.occupation_code || 'N/A'}
- Chức danh: ${cvData.occupation_title || 'N/A'}
- Kinh nghiệm: ${cvData.employment_history || 'N/A'}
- Kỹ năng: ${cvData.skills || 'N/A'}
- Bằng cấp: ${cvData.course || 'N/A'} (${cvData.graduation_year || 'N/A'})
- Tiếng Anh: ${cvData.english_test_type || 'N/A'} ${cvData.english_score || 'N/A'}

VISA PATHWAY: ${visaName} (${visaCode})
YÊU CẦU: ${visaRequirements[visaCode] || 'Visa tiêu chuẩn'}

NHIỆM VỤ:
Phân tích CV và đề xuất các cách chỉnh sửa cụ thể để tối ưu hóa cho visa này. Trả về JSON:
{
  "summary": "Tóm tắt điều chỉnh cần làm (1-2 câu)",
  "suggestions": [
    {
      "field": "employment_history|skills|course|occupation_title",
      "title": "Tiêu đề thay đổi",
      "original": "Nội dung hiện tại",
      "optimized": "Nội dung được tối ưu hóa",
      "reason": "Lý do thay đổi",
      "keywordsToadd": ["keyword1", "keyword2"]
    }
  ],
  "priorityActions": ["Hành động 1 - ưu tiên cao", "Hành động 2"],
  "keywords": ["keyword liên quan đến visa này"]
}

Hãy cụ thể và thực tế. Tập trung vào những từ khóa và cách diễn đạt phù hợp với yêu cầu của visa ${visaCode}.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          suggestions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                title: { type: 'string' },
                original: { type: 'string' },
                optimized: { type: 'string' },
                reason: { type: 'string' },
                keywordsToAdd: { type: 'array', items: { type: 'string' } },
              },
            },
          },
          priorityActions: { type: 'array', items: { type: 'string' } },
          keywords: { type: 'array', items: { type: 'string' } },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});