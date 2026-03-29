# AGENTS.md

Instructions for AI agents working on the Bragazzi's website codebase.

## Project Overview

This is the website for **Bragazzi's**, an Italian deli and café in Sheffield. It is a single-page-style React application with multiple routes, built with **React 19**, **TypeScript**, and **Vite**.

## Tech Stack

- **Runtime/Framework:** React 19, React Router 7, TypeScript 5.9
- **Build Tool:** Vite 7
- **Package Manager:** pnpm (enforced via `preinstall` script — do NOT use npm or yarn)
- **Styling:** Sass/SCSS (no CSS modules — global styles in `src/styles/`)
- **Animation:** Motion (Framer Motion), Lenis (smooth scroll)
- **SEO:** react-helmet-async
- **Linting:** oxlint (void0 tooling) with TypeScript and React plugins
- **Formatting:** oxfmt (void0 tooling)
- **Image Optimization:** vite-plugin-image-optimizer, sharp (via `scripts/optimize-images.mjs`)

## Project Structure

```
src/
├── assets/images/     # Static image assets (jpg, webp, svg)
├── components/        # Shared React components (Layout, Header, Footer, Menu, Cover, etc.)
├── constants/         # Shared constants (breakpoints.json, animations.ts, openingHours.ts)
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
├── utils/             # Utility functions (debounce, imageMap, eventHandlers)
├── App.tsx            # Router setup
└── main.tsx           # App entry point
```

- **Path alias:** `@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`). Always use `@/` imports instead of relative paths.
- **Config files:** `vite.config.ts`, `.oxlintrc.json`, `.oxfmtrc.json`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

## Commands

| Command                | Description                                        |
| ---------------------- | -------------------------------------------------- |
| `pnpm install`         | Install dependencies                               |
| `pnpm dev`             | Start the Vite dev server                          |
| `pnpm build`           | Type-check with `tsc` then build for production    |
| `pnpm preview`         | Preview the production build locally               |
| `pnpm typecheck`       | Run TypeScript type-checking only (`tsc --noEmit`) |
| `pnpm lint`            | Run oxlint with auto-fix                           |
| `pnpm lint:check`      | Run oxlint without auto-fix                        |
| `pnpm format`          | Format all files with oxfmt                        |
| `pnpm format:check`    | Check formatting with oxfmt (no writes)            |
| `pnpm optimize-images` | Optimize images in `src/assets/` using sharp       |

## Code Style & Conventions

- **Follow existing patterns.** Match the style of surrounding code — naming, formatting, file organization.
- **Formatting:** oxfmt handles all formatting. Run `pnpm format` before finalizing changes. Config is in `.oxfmtrc.json`.
- **Linting:** oxlint config is in `.oxlintrc.json`. Run `pnpm lint` to check and auto-fix.
- **TypeScript:** Strict mode. Do not use `any` — prefer explicit types or `unknown`. All files use `.ts` or `.tsx` extensions.
- **Imports:** Use the `@/` path alias for all imports from `src/`. Example: `import debounce from "@/utils/debounce"`.
- **Components:** Functional components only. Use named exports for types/interfaces, default exports for components and hooks.
- **Hooks:** Custom hooks live in `src/hooks/`. Prefix with `use`.
- **Styles:** SCSS partials follow the convention `_componentName.scss` or `_pageName.scss`. Import new partials into `src/styles/main.scss`.
- **Constants:** Shared values go in `src/constants/`. Breakpoints are defined in `breakpoints.json` and shared between JS and SCSS.
- **Images:** Place new images in `src/assets/images/`. Run `pnpm optimize-images` after adding new images. Use the `OptimizedImage` component for rendering images where possible.

## Validation Checklist

Before considering any change complete, ensure:

1. **Type-check passes:** `pnpm typecheck`
2. **Lint passes:** `pnpm lint`
3. **Build succeeds:** `pnpm build`
4. **Visual check (when applicable):** `pnpm dev` and verify the change in the browser

## Key Architecture Notes

- **No test framework is currently configured.** There are no unit or integration tests in this project.
- **No SSR** — this is a client-side SPA, but hooks like `useViewportDimensions` include `typeof window` guards for SSR-safety as a best practice.
- **Routing** is handled by React Router in `src/App.tsx` with lazy-loaded page components.
- **Smooth scrolling** is powered by Lenis via the `useSmoothScroll` hook, used in `Layout.tsx`.
- **Viewport dimensions** are shared via the `useViewportDimensions` hook rather than prop-drilling.
- **Breakpoints** are defined once in `src/constants/breakpoints.json` and consumed by both JS and SCSS.
- **`plan.md`** contains a codebase improvement plan organized into phases. Check it for context on past changes and any remaining work.

## Important Warnings

- **Do NOT use npm or yarn.** This project enforces pnpm. Running `npm install` or `yarn` will fail.
- **Do NOT add `"use client"` directives.** This is not a Next.js project.
- **Do NOT introduce CSS-in-JS or CSS modules.** The project uses global SCSS with a partial-based architecture.
- **Do NOT delete or modify images** without understanding the `imageMap.ts` glob — it auto-discovers images from `src/assets/`.
- **Keep bundle size in mind.** Lazy-load routes (already done in `App.tsx`) and avoid large eager imports.
