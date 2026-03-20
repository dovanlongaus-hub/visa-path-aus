# IMMI PM TASKS (Task Queue)

File này là “nguồn sự thật” để PM Immi điều phối và theo dõi tiến độ giữa các agent.

## Cách dùng
- Mỗi task có `id` duy nhất.
- PM chỉ định `owner` theo role map.
- Owner cập nhật `status` + note kết quả.
- Trước khi merge, PM phải đảm bảo tất cả task `in_progress` hoặc `pending` liên quan đến scope đã chuyển sang `completed` (hoặc `cancelled` nếu không làm).

## Task list

### TASK-001
- `id`: `TASK-001`
- `title`: (TODO) Tách/chuẩn hóa prompt + disclaimer theo chuẩn
- `owner`: Lib/Pure logic agent
- `files`: `src/lib/*`, `src/lib/ai/*`, `src/pages/Chat.jsx` (nếu cần)
- `status`: `pending`
- `definition_of_done`:
  - Giữ nguyên “not legal advice”
  - Giữ behavior hỏi tối đa 3 clarifying questions khi thiếu dữ liệu
  - Nếu tách prompt sang `src/lib/ai/*` => có test cho prompt routing/model selection (nếu áp dụng)
- `test_plan`:
  - `npm run test`

### TASK-002
- `id`: `TASK-002`
- `title`: (TODO) Chuẩn hóa error handling UI vs API layer
- `owner`: API/Integration agent
- `files`: `src/api/*`, `src/pages/*`
- `status`: `pending`
- `definition_of_done`:
  - `src/api/*` throw `Error` có message rõ ràng
  - `src/pages/*` catch error và show user-friendly message
- `test_plan`:
  - `npm run test` (mock fetch/Supabase nếu có)
  - `npm run lint`

### TASK-003
- `id`: `TASK-003`
- `title`: (TODO) Bổ sung unit tests cho logic pure trong `src/lib/*`
- `owner`: Tests agent
- `files`: `src/__tests__/*`, `src/lib/*`
- `status`: `pending`
- `definition_of_done`:
  - Các hàm pure có test tương ứng
  - Network calls được mock
- `test_plan`:
  - `npm run test`

## Notes for PM
- Khi có nhiều task liên quan cùng file, PM ưu tiên gom chung để giảm merge conflict.
- Luôn kiểm tra “layer boundaries” trước khi kết luận `completed`.

