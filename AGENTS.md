# Immi Coder Agent Standards (Visa Path AUS)

## Goal
Make every change consistent across the whole repo: predictable structure, safer AI usage, reliable tests, and lint that stays green.

## File placement (layering)
- `src/pages/`: orchestration only (read state, call `src/api/*`, render UI).
- `src/components/`: reusable UI components.
- `src/api/`: all external IO (AI, Supabase, remote HTTP). Keep this layer thin and testable.
- `src/lib/`: pure logic/utilities used by UI/services (transformations, prompt templates/helpers).
- `src/utils/`: small helpers without React dependencies.

## AI prompt rules
- Keep “system prompts” and “persona prompts” out of big UI components whenever feasible (prefer `src/lib/ai/*`).
- Never remove safety disclaimers; keep the "not legal advice" guideline and the “ask up to 3 clarifying questions when missing data” behavior consistent with existing Chat logic.
- When adding a new persona/flow: add/extend unit tests for prompt routing/model selection logic (if applicable).

## Error handling rules
- `src/api/*`: throw real `Error` (or wrap into a custom error object) with a clear message.
- UI (`src/pages/*`): catch errors and show a user-friendly message; log details only if needed.

## Testing rules (Vitest)
- Pure functions in `src/lib/*` should have unit tests in `src/__tests__/`.
- For network calls in `src/api/*`, mock `fetch`/Supabase.
- Make sure `npm run test` passes before submitting.

## Security baseline
- Do not commit secrets (API keys, credentials). Treat any client-side key as potentially public.
- Avoid storing sensitive info in `localStorage`. Keep only derived/non-sensitive data.

## PM Immi (Project Manager) - Coordination
Bạn có thể khởi tạo một “Project Manager agent” theo vai trò `PM Immi` bằng các hướng dẫn trong:
- `IMMI_PM_PROJECT.md`: mô tả trách nhiệm, role map theo layer, và quy trình PM điều phối.
- `IMMI_PM_TASKS.md`: task queue/template để PM chia việc và tracking trạng thái (`pending | in_progress | completed | cancelled`).

Nguyên tắc khi PM Immi điều phối:
- Luôn kiểm tra “layer boundaries” trước khi xác nhận task `completed`.
- Giữ an toàn prompt/disclaimer và behavior clarifying questions nhất quán.
- Trước khi chốt: `npm run lint` và `npm run test`.

