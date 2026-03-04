import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { profileData } = await req.json();

    if (!profileData) {
      return Response.json({ error: 'Missing profileData' }, { status: 400 });
    }

    const prompt = `Bạn là chuyên gia tư vấn visa Úc. Phân tích hồ sơ người dùng và đề xuất các loại visa phù hợp nhất.

THÔNG TIN HỒ SƠ:
- Họ tên: ${profileData.full_name || 'Chưa rõ'}
- Tuổi: ${profileData.age || 'Chưa rõ'}
- Quốc tịch: ${profileData.nationality || 'Chưa rõ'}
- Trường học: ${profileData.university || 'Chưa rõ'}
- Ngành học: ${profileData.course || 'Chưa rõ'}
- Năm tốt nghiệp: ${profileData.graduation_year || 'Chưa rõ'}
- Tiếng Anh (${profileData.english_test_type || '?'}): ${profileData.english_score || 'Chưa rõ'}
- Kỹ năng/Ngành: ${profileData.occupation_code || profileData.occupation_title || 'Chưa rõ'}
- Kinh nghiệm làm việc: ${profileData.employment_history || 'Chưa rõ'}
- Kinh nghiệm tại Úc: ${profileData.australia_work_years || '0'} năm
- Visa hiện tại: ${profileData.current_visa_type || 'Chưa rõ'}
- Skills Assessment: ${profileData.skills_assessment_done ? 'Đã hoàn thành' : 'Chưa làm'}

YÊÊU CẦU:
Phân tích hồ sơ và trả lại một JSON object có cấu trúc:
{
  "summary": "Tóm tắt điểm mạnh và điểm yếu",
  "recommendations": [
    {
      "visa": "Tên visa (ví dụ: Visa 189)",
      "code": "189",
      "successRate": "Tỷ lệ thành công (high/medium/low)",
      "timeline": "Thời gian (ví dụ: 12-18 tháng)",
      "requirements": ["Yêu cầu 1", "Yêu cầu 2"],
      "gaps": ["Khoảng cách 1", "Khoảng cách 2"],
      "nextSteps": ["Bước 1", "Bước 2"],
      "notes": "Ghi chú thêm"
    }
  ],
  "immediateActions": ["Hành động 1", "Hành động 2"],
  "estimatedPoints": "Ước tính điểm EOI (nếu có)"
}

Phân tích kỹ lưỡng và gợi ý 3-4 visa pathway có khả năng thành công cao nhất. Ưu tiên visa từ dễ nhất đến khó nhất.`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          summary: { type: 'string' },
          recommendations: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                visa: { type: 'string' },
                code: { type: 'string' },
                successRate: { type: 'string' },
                timeline: { type: 'string' },
                requirements: { type: 'array', items: { type: 'string' } },
                gaps: { type: 'array', items: { type: 'string' } },
                nextSteps: { type: 'array', items: { type: 'string' } },
                notes: { type: 'string' }
              }
            }
          },
          immediateActions: { type: 'array', items: { type: 'string' } },
          estimatedPoints: { type: 'string' }
        }
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});