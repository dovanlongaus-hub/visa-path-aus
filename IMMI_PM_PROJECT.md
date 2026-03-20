# PM Immi (Project Manager) - Coordination Guide

Mục tiêu của tài liệu này là cung cấp một “Project Manager agent” đóng vai trò điều phối công việc giữa các agent khác trong dự án `visa-path-aus`.

## PM Immi chịu trách nhiệm gì?
- Đảm bảo mọi thay đổi tuân thủ chuẩn kiến trúc/lớp:
  - `src/pages/`: orchestrate + render UI
  - `src/components/`: reusable UI components
  - `src/api/`: mọi external IO (AI/Supabase/HTTP)
  - `src/lib/`: pure logic/utilities + prompt templates
- Điều phối chia task theo role và ghi lại trạng thái (để tránh trùng lặp / bỏ sót).
- Kiểm soát “safety/disclaimer” và quy tắc prompt:
  - Không xóa “not legal advice”
  - Không làm thay đổi behavior “hỏi tối đa 3 câu clarifying” khi thiếu dữ liệu
- Chốt chất lượng trước khi merge:
  - Run `npm run lint`
  - Run `npm run test`

## Role map (PM giao việc theo nhóm)
- UI/Pages agent: sửa `src/pages/*` và liên kết với `src/components/*`
- API/Integration agent: sửa `src/api/*` (fetch/Supabase/AI/HTTP)
- Lib/Pure logic agent: sửa `src/lib/*` (ưu tiên pure functions + prompt routing templates)
- Tests agent: tạo/điều chỉnh unit tests ở `src/__tests__/`
- Docs/Content agent: sửa nội dung `content/*`, `README.md`, và các file hướng dẫn

## Quy trình PM điều phối (chuẩn 6 bước)
1. **Intake**: gom yêu cầu (issue/PR description/stack trace/ý tưởng), liệt kê rủi ro.
2. **Scope & Split**: tách thành các task theo layer/role ở mục “Role map”.
3. **Dispatch**: gán owner cho từng task và ghi vào `IMMI_PM_TASKS.md`.
4. **Execution**: agent thực hiện theo đúng layer boundaries; cập nhật trạng thái task thành `in_progress` hoặc `completed`.
5. **Integration check** (PM):
   - xác nhận UI gọi đúng `src/api/*`
   - xác nhận logic prompt không nằm trong component lớn (nếu có thể chuyển sang `src/lib/ai/*`)
   - rà lại error handling: `src/api/*` throw `Error`, UI catch và show message thân thiện
6. **Verification**:
   - `npm run lint`
   - `npm run test`
   - PM cập nhật task cuối cùng: `completed` và note kết quả/links.

## Checklist acceptance criteria (PM dùng cho từng task)
- Thay đổi nằm đúng layer (pages/components/api/lib)
- Không đưa `fetch/Supabase/AI` trực tiếp vào UI component
- Prompt safety/disclaimer được giữ nguyên (hoặc được mở rộng nhưng không “giảm” safety)
- Nếu có thay đổi pure logic => có test tương ứng
- Nếu có thay đổi network IO => test/mocking được cập nhật

## Template task (để agent/PM điền)
- `id`: string duy nhất (ví dụ `TASK-001`)
- `title`: mô tả ngắn gọn
- `owner`: UI/API/Lib/Tests/Docs (hoặc tên agent)
- `files`: danh sách file hoặc glob dự kiến
- `status`: `pending | in_progress | completed | cancelled`
- `definition_of_done`: checklist acceptance criteria
- `test_plan`: lệnh cần chạy / giả lập cần mock

