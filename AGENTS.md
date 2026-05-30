# AGENTS.md

Instructions for AI agents working on the Bragazzi's website codebase.

## Project Overview

This is the website for **Bragazzi's**, an Italian deli and café in Sheffield. It is a single-page-style React
application with multiple routes, built with **React 19**, **TypeScript**, and **Vite**.

## Tech Stack

- **Runtime/Framework:** React 19, React Router 7, TypeScript 6.0
- **Build Tool:** Vite 8 (managed via Vite+)
- **Styling:** Sass/SCSS (no CSS modules — global styles in `src/styles/`)
- **Animation:** Motion (Framer Motion), Lenis (smooth scroll)
- **SEO:** react-helmet-async
- **Image Optimization:** vite-imagetools (build-time responsive AVIF/WebP/fallback generation via sharp)
- **Visual Testing:** Playwright visual regression tests (Chromium only)

## Project Structure

```
src/
├── assets/            # Static assets
│   ├── fonts/         # Project fonts (ttf, woff2, etc.)
│   └── images/        # Static image assets (jpg, png, svg — high-quality originals)
├── components/        # Shared React components (Layout, Header, Footer, Menu, Cover, etc.)
├── constants/         # Shared constants (breakpoints.ts, animations.ts, openingHours.ts)
├── data/              # Data files (galleryImages.ts)
├── hooks/             # Custom React hooks (useSmoothScroll, useViewportDimensions)
├── pages/             # Route-level page components (Home, LaStoria, IlGiorno, NotFound)
├── styles/            # Global SCSS files
│   ├── components/    # Component-specific SCSS partials
│   ├── pages/         # Page-specific SCSS partials
│   ├── main.scss      # Entry point that imports all partials
│   ├── _variables.scss
│   ├── _typography.scss
│   ├── _breakpoints.scss
│   └── _normalize.scss
├── types/             # TypeScript type definitions (imagetools.ts, etc.)
├── App.tsx            # Router setup
└── main.tsx           # App entry point
```

- **Path alias:** `@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`). Always use `@/` imports
  instead of relative paths.
- **Config files:** `vite.config.ts`, `tsconfig.json`

## Code Style & Conventions

- **Follow existing patterns.** Match the style of surrounding code — naming, formatting, file organization.
- **TypeScript:** Strict mode. Do not use `any` — prefer explicit types or `unknown`. All files use `.ts` or `.tsx`
  extensions.
- **Imports:** Use the `@/` path alias for all imports from `src/`. Example: `import { OptimizedImage } from "@/components/OptimizedImage"`.
- **Components:** Functional components only. Use named exports for everything (components, hooks, types, interfaces).
- **Hooks:** Custom hooks live in `src/hooks/`. Prefix with `use`.
- **Styles:** SCSS partials follow the convention `_componentName.scss` or `_pageName.scss`. Import new partials into
  `src/styles/main.scss`.
- **Constants:** Shared values go in `src/constants/`. Breakpoints are defined in `breakpoints.ts` and shared between
  JS and SCSS.
- **Images:** Keep high-quality `.jpg` originals in `src/assets/images/`; do not overwrite or resize them. Use
  `vite-imagetools` import queries to generate responsive AVIF/WebP/fallback variants at build time. Use the shared
  `OptimizedImage` component for rendering images where possible. Existing `.webp` files are not source assets and
  should not be imported directly.

## GitHub Workflow

- **Start issue branches from an up-to-date `main`.** Before branching from `main`, fetch the latest remote changes and
  fast-forward or pull `main`.
- **Raise pull requests as ready for review.** Do not create draft PRs unless the user explicitly asks for a draft.
- **Use squash merges only when merging pull requests.** Merge commits are not allowed in this repository.
- **Close completed issues from PR descriptions.** When a pull request completes one or more GitHub issues, include a
  closing keyword for each issue in the PR description, such as `Closes #3`.

## Key Architecture Notes

- **No SSR** — this is a client-side SPA, but hooks like `useViewportDimensions` include `typeof window` guards for
  SSR-safety as a best practice.
- **Routing** is handled by React Router in `src/App.tsx` with lazy-loaded page components. Pages use named exports; `App.tsx` maps them to default exports for `React.lazy`.
- **Smooth scrolling** is powered by Lenis via the `useSmoothScroll` hook, used in `Layout.tsx`.
- **Viewport dimensions** are shared via the `useViewportDimensions` hook rather than prop-drilling.
- **Breakpoints** are defined once in `src/constants/breakpoints.ts` and consumed by both JS and SCSS.

## Visual Regression Troubleshooting

- When `vp run test:visual` fails, do not update baselines automatically. Treat baseline updates as approval of an
  intentional visual change.
- Inspect the Playwright output in `test-results/` and `playwright-report/` to compare expected, actual, and diff
  images.
- Decide whether the difference is an intentional visual change or an unintended regression.
- If it is a regression, fix the source code, styles, or assets and rerun `vp check --fix`, `vp test`, and
  `vp run test:visual`.
- If the visual change is intentional, update baselines with `vp run test:visual:update`, then review the changed PNGs
  before committing them.
- Do not loosen screenshot thresholds or add broad waits unless the failure is proven to be nondeterministic rendering
  noise.
- CI runs on Linux with centralized Chromium baselines. Local macOS runs may differ slightly, so CI diffs should be
  treated as the source of truth when platform rendering differences appear.
- Do not commit `playwright-report/` or `test-results/`; only commit intentional baseline images under
  `tests/visual/__screenshots__/`.

## Important Warnings

- **Do NOT add `"use client"` directives.** This is not a Next.js project.
- **Do NOT introduce CSS-in-JS or CSS modules.** The project uses global SCSS with a partial-based architecture.
- **Do NOT delete or modify `.jpg` originals** in `src/assets/images/`. Responsive variants are generated at build time
  by `vite-imagetools`.
- **Keep bundle size in mind.** Lazy-load routes (already done in `App.tsx`) and avoid large eager imports.
- **No default exports.** The project enforces named exports via linting.
- **Keep AGENTS.md updated.** After finishing a task, update this file if any of your changes make its current content invalid or outdated.

<!--VITE PLUS START-->

## Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Common Pitfalls

- **Running scripts:** Vite+ built-in commands (`vp lint`, `vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool. Use `vp run <script>` to run `package.json` scripts or tasks defined in `vite.config.ts`
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. Do not install or upgrade them, use Vite+ directly.
- **Import JavaScript modules from `vite-plus`:** Import modules from the `vite-plus` dependency, not from `vite` or `vitest`. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.

### Codex Sandbox Note

When starting the local dev server in Codex, `vp dev --host 127.0.0.1` may fail with `listen EPERM` because binding a localhost port requires approval. If that happens, rerun the same command with escalated permission rather than changing the host, port, or dev tooling.

### Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Run `vp run test:visual` when changing layout, typography, imagery, animation, or scroll behavior.
- [ ] Check if there are tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

- Docs: https://viteplus.dev/guide/

<!--VITE PLUS END-->
