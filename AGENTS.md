# AGENTS.md

Instructions for AI agents working on the Bragazzi's website codebase.

## Project Overview

This is the website for **Bragazzi's**, an Italian deli and café in Sheffield. It is a single-page-style React
application with multiple routes, built with **React 19**, **TypeScript**, and **Vite**.

## Tech Stack

- **Runtime/Framework:** React 19, React Router 7, TypeScript 5.9
- **Build Tool:** Vite 8 (managed via Vite+)
- **Styling:** Sass/SCSS (no CSS modules — global styles in `src/styles/`)
- **Animation:** Motion (Framer Motion), Lenis (smooth scroll)
- **SEO:** react-helmet-async
- **Image Optimization:** vite-imagetools (build-time responsive AVIF/WebP/fallback generation via sharp)

## Project Structure

```
src/
├── assets/images/     # Static image assets (jpg, png, svg — high-quality originals)
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
├── App.tsx            # Router setup
└── main.tsx           # App entry point
```

- **Path alias:** `@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`). Always use `@/` imports
  instead of relative paths.
- **Config files:** `vite.config.ts`, `tsconfig.json`

## Code Style & Conventions

- **Follow existing patterns.** Match the style of surrounding code — naming, formatting, file organization.
- **TypeScript:** Strict mode. Do not use `any` — prefer explicit types or `unknown`. All files use `.ts` or `.tsx`
  extensions.
- **Imports:** Use the `@/` path alias for all imports from `src/`. Example: `import { OptimizedImage } from "@/components/OptimizedImage"`.
- **Components:** Functional components only. Use named exports for types/interfaces, default exports for components and
  hooks.
- **Hooks:** Custom hooks live in `src/hooks/`. Prefix with `use`.
- **Styles:** SCSS partials follow the convention `_componentName.scss` or `_pageName.scss`. Import new partials into
  `src/styles/main.scss`.
- **Constants:** Shared values go in `src/constants/`. Breakpoints are defined in `breakpoints.ts` and shared between
  JS and SCSS.
- **Images:** Keep high-quality `.jpg` originals in `src/assets/images/`; do not overwrite or resize them. Use
  `vite-imagetools` import queries to generate responsive AVIF/WebP/fallback variants at build time. Use the shared
  `OptimizedImage` component for rendering images where possible. Existing `.webp` files are not source assets and
  should not be imported directly.

## Key Architecture Notes

- **No SSR** — this is a client-side SPA, but hooks like `useViewportDimensions` include `typeof window` guards for
  SSR-safety as a best practice.
- **Routing** is handled by React Router in `src/App.tsx` with lazy-loaded page components.
- **Smooth scrolling** is powered by Lenis via the `useSmoothScroll` hook, used in `Layout.tsx`.
- **Viewport dimensions** are shared via the `useViewportDimensions` hook rather than prop-drilling.
- **Breakpoints** are defined once in `src/constants/breakpoints.ts` and consumed by both JS and SCSS.
- **`plan.md`** contains a codebase improvement plan organized into phases. Check it for context on past changes and any
  remaining work.

## Important Warnings

- **Do NOT add `"use client"` directives.** This is not a Next.js project.
- **Do NOT introduce CSS-in-JS or CSS modules.** The project uses global SCSS with a partial-based architecture.
- **Do NOT delete or modify `.jpg` originals** in `src/assets/images/`. Responsive variants are generated at build time
  by `vite-imagetools`.
- **Keep bundle size in mind.** Lazy-load routes (already done in `App.tsx`) and avoid large eager imports.

<!--VITE PLUS START-->

## Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Common Pitfalls

- **Running scripts:** Vite+ built-in commands (`vp lint`, `vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool. Use `vp run <script>` to run `package.json` scripts or tasks defined in `vite.config.ts`
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. Do not install or upgrade them, use Vite+ directly.
- **Import JavaScript modules from `vite-plus`:** Import modules from the `vite-plus` dependency, not from `vite` or `vitest`. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.

### Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

* Docs: https://viteplus.dev/guide/
    <!--VITE PLUS END-->
