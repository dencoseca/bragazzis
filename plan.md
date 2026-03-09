# Migration Plan: Bragazzi's Website

This document outlines the plan for migrating the existing Gatsby-based website to a modern tech stack using Vite, React, TypeScript, and pnpm.

## Tech Stack & Tools

- **Package Manager**: `pnpm`
- **Build Tool**: `Vite` (for fast development and efficient static builds)
- **UI Framework**: `React` (v19)
- **Language**: `TypeScript` (v5+)
- **Package Management Rule**: Always use `pnpm`. Enforce this in `package.json` using the `packageManager` field and a `preinstall` script (e.g., `"preinstall": "npx only-allow pnpm"`) to ensure `npm` usage errors. Always install the latest version of packages with `pnpm` (e.g., `pnpm add [package]@latest`).
- **Styling Rule**: Use **CSS Modules** for all component-level styling (using Sass `.module.scss`).
- **Path Aliases Rule**: Use `@/` for `src` to simplify imports across the project.
- **Metadata Rule**: Use `react-helmet-async` for page titles and SEO tags.
- **Scrolling Library**: `locomotive-scroll` (replaces custom scroll logic and `react-scroll`)
- **Animations**: `motion` (successor to `framer-motion` from v11+; the package to install is `motion`; maintained from the old project for consistent transitions)
- **Styles**: `Sass` (maintained from the old project to preserve the original design)
- **Linting**: `eslint` (industry standard linter)
- **Formatting**: `prettier` (industry standard formatter)
- **Image Optimization**: `vite-plugin-image-optimizer` (uses `sharp` under the hood, popular and well-maintained)

## Migration Phases

This plan is divided into phases to be executed sequentially. To track progress, mark tasks with `[x]` when complete.

### Phase 1: Project Setup & Configuration [ ]
- [ ] Initialize a new Vite project in the root with the `react-ts` template.
- [ ] Configure `pnpm` as the package manager and enforce its use:
  - Add `"packageManager": "pnpm@10.x.x"` to `package.json`.
  - Add `"preinstall": "npx only-allow pnpm"` to `package.json` scripts.
- [ ] Install dependencies:
  - `sass`, `locomotive-scroll`, `motion`, `clsx`, `react-helmet-async`, `react-router-dom`.
  - Dev dependencies: `eslint`, `prettier`, `vite-plugin-image-optimizer`, `vite-plugin-svgr`.
- [ ] Configure `vite.config.ts` (image optimizer, svgr, path aliases).
- [ ] Configure `tsconfig.json` (strict type checking, path aliases `@/*`).
- [ ] Add `lint` (using `eslint --fix`) and `format` (using `prettier --write`) scripts to `package.json`.

### Phase 2: Asset & Style Migration [ ]
- [ ] Copy fonts from `bragazzis-gatsby/src/fonts` to `src/assets/fonts` and create global `@font-face` rules.
- [ ] Copy images from `bragazzis-gatsby/src/images` to `src/assets/images`.
- [ ] Copy SCSS files from `bragazzis-gatsby/src/styles` to `src/styles` and create `src/styles/main.scss`.
- [ ] Set up CSS Modules (`.module.scss`) for component-level styling to avoid collisions.
- [ ] Ensure original breakpoints (760px, 1080px) are maintained in SCSS variables.

### Phase 3: Core Infrastructure & Shared Components [ ]
- [ ] Implement `locomotive-scroll` within a custom hook or the main `App` component.
- [ ] Create `Layout` component (including `Header`, `Footer`, `Menu`) in TSX.
- [ ] Setup `react-router-dom` routing and `react-helmet-async` provider.
- [ ] Create `src/constants/openingHours.ts` with hard-coded data (avoiding Google APIs).

### Phase 4: Page Migration (TSX) [ ]
- [ ] Migrate `index.js` content to `src/pages/Home.tsx`.
- [ ] Migrate `lastoria.js` content to `src/pages/LaStoria.tsx`.
- [ ] Migrate `ilgiorno.js` content to `src/pages/IlGiorno.tsx`.
- [ ] Convert all sub-components (`Cover`, `FloatingItems`, `FullWidthBanner`, etc.) to TSX using path aliases and CSS Modules.

### Phase 5: Optimization & Verification [ ]
- [ ] Configure `vite-plugin-image-optimizer` for final build settings.
- [ ] Run `eslint --fix` and `prettier --write` to ensure code quality and consistency.
- [ ] Verify responsiveness at the original breakpoints (760px and 1080px).
- [ ] Execute `pnpm build` and preview the static site in the `dist` folder to ensure animations and styles are preserved.
