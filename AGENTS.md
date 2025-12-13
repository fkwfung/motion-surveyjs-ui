# AGENTS.md

This repository is a **React + TypeScript library** that renders **SurveyJS JSON models** using `survey-core`.
LLM agents working in this codebase should follow the guidelines below to keep changes maintainable, minimal, and professional.

## Goals

- Provide a clean, modern developer experience (DX) for rendering SurveyJS model data in React.
- Keep the public API small, stable, and well-typed.
- Maintain a predictable build output: **ESM + CJS + `.d.ts` + `style.css`**.

## Non-goals (unless explicitly requested)

- Do not add large frameworks, monorepos, or heavy styling systems.
- Do not introduce new tooling (linters/test runners/build tools) unless required.
- Do not re-architect the library beyond what the issue/task requires.

## Project commands

- Dev demo: `npm run dev`
- Typecheck (app only): `npm run typecheck`
- Unit tests: `npm run test`
- Lint: `npm run lint`
- Build library: `npm run build`

## Repository structure

- `src/index.ts` — library entrypoint (exports + CSS import)
- `src/lib/*` — library components
- `src/style.css` — exported library stylesheet
- `src/App.tsx` — demo app (not part of library API)
- `vite.config.ts` — library build config (externalizes React)
- `tsconfig.build.json` — emits type declarations into `dist/`

## Build & packaging rules

- React and ReactDOM must remain **peerDependencies** and externalized in bundling.
- Library output is expected in `dist/`:
  - `dist/index.js` (ESM)
  - `dist/index.cjs` (CJS)
  - `dist/index.d.ts` (types)
  - `dist/style.css` (CSS)
- Avoid bundling unnecessary assets into `dist/`.
- Keep `exports` in `package.json` accurate; if you change output names/paths, update exports.

## Code standards

- TypeScript strict mode: keep types accurate and avoid `any`.
- Prefer small, composable components.
- No dead code: remove unused imports/variables.
- Accessibility is required:
  - Use semantic controls (`label` + `htmlFor`, keyboard-operable inputs)
  - Ensure required fields and errors are conveyed in an accessible way

## Reasoning & decision guidelines (for future maintenance)

When implementing a feature or fixing a bug, follow this decision process:

1. **Clarify the contract**
   - What is the user-visible behavior?
   - Is it part of the public API? If yes, document it in `README.md`.

2. **Minimize surface area**
   - Prefer adding one small prop/API over adding a new subsystem.
   - Avoid breaking changes; if unavoidable, make it explicit and document migration.

3. **Be explicit about ownership**
   - If a prop accepts a `Model`, treat it as externally owned (don’t mutate configuration unexpectedly).
   - If a prop accepts JSON, the component owns the created model.

4. **Prefer predictable state flows**
   - Subscribe to SurveyJS events (`onValueChanged`, `onCurrentPageChanged`, etc.) to trigger React updates.
   - Avoid hidden side-effects that make rendering non-deterministic.

5. **Validate with existing scripts**
   - Before finishing, ensure: `npm run lint && npm run test && npm run build`.
   - If you add a feature, add at least a minimal test that asserts the behavior.

6. **Performance & bundle discipline**
   - Avoid adding runtime dependencies unless necessary.
   - Keep tree-shaking friendly exports.
   - Prefer CSS variables/tokens for theming rather than runtime-heavy styling solutions.

7. **Error handling philosophy**
   - Fail soft in UI when possible (show a reasonable fallback).
   - Avoid throwing during render for user-supplied survey JSON.

## PR / change management

- Keep changes scoped to the requested issue.
- Prefer multiple small commits over one large refactor.
- Update `README.md` when you add/modify public APIs.

## Security / safety

- Do not log or persist survey response data by default.
- Do not introduce network calls/telemetry.
