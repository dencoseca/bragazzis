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

- **Path alias:** `@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`). Always use `@/` imports
  instead of relative paths.
- **Config files:** `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`

## Code Style & Conventions

- **Follow existing patterns.** Match the style of surrounding code — naming, formatting, file organization.
- **TypeScript:** Strict mode. Do not use `any` — prefer explicit types or `unknown`. All files use `.ts` or `.tsx`
  extensions.
- **Imports:** Use the `@/` path alias for all imports from `src/`. Example: `import debounce from "@/utils/debounce"`.
- **Components:** Functional components only. Use named exports for types/interfaces, default exports for components and
  hooks.
- **Hooks:** Custom hooks live in `src/hooks/`. Prefix with `use`.
- **Styles:** SCSS partials follow the convention `_componentName.scss` or `_pageName.scss`. Import new partials into
  `src/styles/main.scss`.
- **Constants:** Shared values go in `src/constants/`. Breakpoints are defined in `breakpoints.json` and shared between
  JS and SCSS.
- **Images:** Place new images in `src/assets/images/`. Run `vp run optimize-images` after adding new images. Use the
  `OptimizedImage` component for rendering images where possible.

## Key Architecture Notes

- **No SSR** — this is a client-side SPA, but hooks like `useViewportDimensions` include `typeof window` guards for
  SSR-safety as a best practice.
- **Routing** is handled by React Router in `src/App.tsx` with lazy-loaded page components.
- **Smooth scrolling** is powered by Lenis via the `useSmoothScroll` hook, used in `Layout.tsx`.
- **Viewport dimensions** are shared via the `useViewportDimensions` hook rather than prop-drilling.
- **Breakpoints** are defined once in `src/constants/breakpoints.json` and consumed by both JS and SCSS.
- **`plan.md`** contains a codebase improvement plan organized into phases. Check it for context on past changes and any
  remaining work.

## Important Warnings

- **Do NOT add `"use client"` directives.** This is not a Next.js project.
- **Do NOT introduce CSS-in-JS or CSS modules.** The project uses global SCSS with a partial-based architecture.
- **Do NOT delete or modify images** without understanding the `imageMap.ts` glob — it auto-discovers images from
  `src/assets/`.
- **Keep bundle size in mind.** Lazy-load routes (already done in `App.tsx`) and avoid large eager imports.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`. For example, if you have a custom `dev` script that runs multiple services concurrently, run it with `vp run dev`, not `vp dev` (which always starts Vite's dev server).
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## CI Integration

For GitHub Actions, consider using [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) to replace separate `actions/setup-node`, package-manager setup, cache, and install steps with a single action.

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
      cache: true
- run: vp check
- run: vp test
```

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
  <!--VITE PLUS END-->
