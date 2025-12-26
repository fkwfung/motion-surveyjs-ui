# motion-surveyjs-ui Constitution

## Core Principles

### I. Library-First & Developer Experience
Provide a clean, modern developer experience (DX) for rendering SurveyJS model data in React. Keep the public API small, stable, and well-typed. Maintain a predictable build output (ESM + CJS + .d.ts + style.css).

### II. Architecture & Tech Stack
Built on **React + TypeScript**. Uses **Radix UI** for accessible UI primitives and **motion.dev** for animations. Renders **SurveyJS** JSON models using `survey-core`. Do not introduce new frameworks or heavy styling systems unless explicitly requested.

### III. Build & Packaging Discipline
React, ReactDOM, `survey-core`, `@radix-ui/*`, and `motion/*` must remain **peerDependencies** and externalized. Output must be tree-shakable. Avoid bundling unnecessary assets.

### IV. Accessibility & Standards
**TypeScript strict mode** is mandatory. **Accessibility is required**: use semantic controls and ensure errors/required fields are accessible. No dead code.

### V. Styling Strategy
Prefer **CSS custom properties** for theming/overrides. Keep classnames stable. Avoid hardcoding colors. Updates to CSS variables must be documented in `STYLING-CSS-GUIDE.md`.

## Testing & Quality Standards

### Unit Testing
- Runner: **Vitest** with **React Testing Library**.
- Requirement: New features must have unit tests.
- Strategy: Prefer accessibility-first assertions (`getByRole`, `getByLabelText`). Avoid snapshot tests for whole pages.
- Animations: Assert stateful outputs (classes, presence), not frame-by-frame visuals.

### Validation
- All changes must pass: `npm run lint && npm run test && npm run build`.
- Fail soft in UI where possible; avoid throwing during render for user-supplied JSON.

## Development Workflow

### Decision Guidelines
1. **Clarify Contract**: Document public API changes in `README.md`.
2. **Minimize Surface**: Prefer small props over new subsystems.
3. **Explicit Ownership**: Component owns JSON-created models; treat passed Models as external.
4. **Predictable State**: Subscribe to SurveyJS events to trigger updates.

### PR & Change Management
- Scope changes to the requested issue.
- Prefer multiple small commits.
- Security: Do not log or persist survey response data by default.

## Governance

This constitution governs all development in `motion-surveyjs-ui`.
- **Documentation**: Public API changes require `README.md` updates. CSS changes require `STYLING-CSS-GUIDE.md` updates.
- **Versioning**: Follow Semantic Versioning.
- **Alignment**: This document reflects the standards defined in `AGENTS.md` and `README.md`.

**Version**: 1.0.0 | **Ratified**: 2025-12-26
