# Code Style & Conventions (Visa Path AUS)

## JavaScript / JSX
- Prefer `const` over `let` (unless reassignment is required).
- Naming:
  - Components: `PascalCase`
  - Functions/vars: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- Imports:
  - Third-party first, then `@/...` alias imports, then relative `./...`.
- Hooks:
  - Only call hooks at the top level of components/custom hooks.
  - Keep hook dependencies stable (use `useCallback` for callbacks passed to effects).

## Folder conventions
- If you find yourself writing “business rules” inside a component, move them to `src/lib/*`.
- If it involves IO (fetch, Supabase, AI requests), move it to `src/api/*`.

## Lint / test
- Keep `npm run lint` green.
- For non-UI pure logic: add Vitest tests.

