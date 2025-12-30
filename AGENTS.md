# Repository Guidelines

## Project Structure & Module Organization
- `Haeyo/` is the primary Vite + React + TypeScript app.
- `Haeyo/src/` contains application code: `pages/` for route-level screens, `components/` for reusable UI, `api/` for HTTP helpers, `hooks/` for shared hooks, and `types/` for TypeScript models.
- `Haeyo/src/assets/` and `Haeyo/public/` hold static assets.
- Root-level `pages/` and `types/` exist; treat them as legacy or scratch unless a task explicitly references them.

## Build, Test, and Development Commands
Run these from `Haeyo/`:
- `npm run dev` starts the Vite dev server with HMR.
- `npm run build` runs type-checking (`tsc -b`) and produces a production build.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint on the codebase.

## Coding Style & Naming Conventions
- TypeScript + React functional components with hooks; keep components in `PascalCase`.
- Use CSS Modules alongside components: `Component.module.css`.
- Existing code uses 2-space indentation, single quotes, and semicolons; follow the current style.
- Linting is enforced via `Haeyo/eslint.config.js` (TypeScript + React Hooks + React Refresh).

## Testing Guidelines
- No test framework is configured yet. If you add tests, keep them near the feature (e.g., `Haeyo/src/pages/Home/HomeWeb.test.tsx`) and document the runner in this file.

## Commit & Pull Request Guidelines
- Commit history uses a `type :: message` format (e.g., `feat :: 로그인 구현`, `chore :: 의존성 설정`). Follow that convention.
- PRs should include a short summary, screenshots for UI changes, and any relevant issue links.

## Configuration Tips
- Environment and build settings live in `Haeyo/vite.config.ts` and `Haeyo/tsconfig*.json`.
- Keep API helpers centralized in `Haeyo/src/api/` to avoid duplication.
