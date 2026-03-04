import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { title, category, visaCode, topic } = await req.json();

    if (!title || !category) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const categoryDescriptions = {
      visa_types: 'Giới thiệu chi tiết về loại visa, điều kiện, thời gian xử lý',
      requirements: 'Các yêu cầu cụ thể: documents, qualifications, points',
      interview: 'Kinh nghiệm phỏng vấn, câu hỏi thường gặp, mẹo trả lời',
      common_mistakes: 'Những lỗi phổ biến mà ứng viên mắc phải và cách tránh',
      application_process: 'Quy trình nộp đơn bước theo bước, tài liệu cần thiết',
      points_system: 'Cách tính điểm EOI SkillSelect, chiến lược tối ưu điểm',
      skills_assessment: 'Quy trình Skills Assessment, các tổ chức, chi phí và timeline'
    };

    const prompt = `Bạn là chuyên gia tư vấn di trú Úc. Hãy viết một bài viết chi tiết, chuyên sâu và hữu ích cho Knowledge Base của ứng dụng Úc Di Trú AI.

THÔNG TIN BÀI VIẾT:
- Tiêu đề: ${title}
- Danh mục: ${categoryDescriptions[category]}
${visaCode ? `- Visa liên quan: ${visaCode}` : ''}
${topic ? `- Chủ đề cụ thể: ${topic}` : ''}

YÊU CẦU:
1. Viết bằng tiếng Việt, chuyên nghiệp nhưng dễ hiểu
2. Sử dụng markdown formatting (headings, lists, bold, italic)
3. Bài viết dài 800-1500 từ, chi tiết và toàn diện
4. Bao gồm:
   - Giới thiệu ngắn gọn (2-3 dòng)
   - Nội dung chính với headings rõ ràng
   - Các ví dụ cụ thể hoặc case study
   - Tips hoặc lời khuyên từ kinh nghiệm
   - Kết luận và next steps
5. Sử dụng bullet points, numbered lists khi cần
6. Thêm bảng so sánh nếu có liên quan
7. Cảnh báo các điểm quan trọng bằng blockquote (> ...) 
8. Tông giọng: chuyên nghiệp, tin cậy, giúp ích
9. Trả về JSON đúng format

ĐỊNH DẠNG JSON TRẢ VỀ:
{
  "title": "${title}",
  "summary": "Tóm tắt 1-2 câu",
  "content": "Nội dung markdown đầy đủ",
  "reading_time": số_phút_đọc,
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          summary: { type: 'string' },
          content: { type: 'string' },
          reading_time: { type: 'number' },
          tags: { type: 'array', items: { type: 'string' } },
        },
      },
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});