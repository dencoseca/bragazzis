# Migration Plan: Bragazzi's Website

This document outlines the plan for migrating the existing Gatsby-based website to a modern tech stack using Vite, React, TypeScript, and pnpm.

## Tech Stack & Tools

- **Package Manager**: `pnpm`
- **Build Tool**: `Vite` (for fast development and efficient static builds)
- **UI Framework**: `React` (v19)
- **Language**: `TypeScript` (v5+)
- **Package Management Rule**: Always install the latest version of packages with `pnpm` (e.g., `pnpm add [package]@latest`).
- **Styling Rule**: Use **CSS Modules** for all component-level styling (using Sass `.module.scss`).
- **Path Aliases Rule**: Use `@/` for `src` to simplify imports across the project.
- **Metadata Rule**: Use `react-helmet-async` for page titles and SEO tags.
- **Scrolling Library**: `locomotive-scroll` (replaces custom scroll logic and `react-scroll`)
- **Animations**: `framer-motion` (maintained from the old project for consistent transitions)
- **Styles**: `Sass` (maintained from the old project to preserve the original design)
- **Linting**: `oxlint` (extremely fast linter)
- **Formatting**: `oxfmt` (fast formatter)
- **Image Optimization**: `vite-plugin-image-optimizer` (uses `sharp` under the hood, popular and well-maintained)

## Migration Steps

### 1. Initialize Project
- Initialize a new Vite project in the root with the `react-ts` template.
- Configure `pnpm` as the package manager.
- Install necessary dependencies:
  - `sass`, `locomotive-scroll`, `framer-motion`, `clsx`, `tailwind-merge`, `react-helmet-async`, `react-router-dom`.
  - Development dependencies: `oxlint`, `oxfmt`, `vite-plugin-image-optimizer`.
- **Note**: Always use the `@latest` tag when installing (e.g., `pnpm add react@latest`).

### 2. Configure Tools
- **Vite**: Set up `vite.config.ts` with the image optimizer plugin.
- **TypeScript**: Configure `tsconfig.json` for strict type checking and path aliases (e.g., `@/components`, `@/assets`).
- **Oxlint/Oxfmt**: Add scripts to `package.json` for linting and formatting.

### 3. Asset Migration
- **Fonts**: Copy all fonts from `bragazzis-gatsby/src/fonts` to `src/assets/fonts`. Create a global CSS/SCSS file to define `@font-face` rules.
- **Images**: Copy all images from `bragazzis-gatsby/src/images` to `src/assets/images`. Vite will handle these via imports or the public directory.
- **SVG**: For the logo and other SVGs, consider using `vite-plugin-svgr` for easier React component usage.

### 4. Style Migration
- Copy all SCSS files from `bragazzis-gatsby/src/styles` to `src/styles`.
- Refactor global styles and variables into a central entry point (e.g., `src/styles/main.scss`).
- **CSS Modules**: For each component, create a corresponding `.module.scss` file. Migrate component-specific styles from the original SCSS files to these modules to avoid global namespace collisions.
- Maintain the original breakpoints:
  - Mobile: `760px`
  - Tablet: `1080px`
- Update style imports in components to match the new structure.

### 5. Component & Page Migration (TSX)
- Convert all React components and pages to TypeScript (`.tsx`).
- **Path Aliases**: Use `@/` for all imports to keep code clean.
- **Layout**: Implement a main `Layout` component that includes the `Header`, `Footer`, and `Menu`.
- **Metadata**: Integrate `react-helmet-async` within the `Layout` or individual pages to manage SEO titles and tags.
- **Navigation**: Use `react-router-dom` for client-side routing between `/`, `/lastoria`, and `/ilgiorno`.
- **Opening Hours**: Hard-code the opening hours in a constant file (e.g., `src/constants/openingHours.ts`) instead of fetching from Google APIs.
- **Static Content**: Migrate the content from `index.js`, `lastoria.js`, and `ilgiorno.js` to their respective page components.

### 6. Implement Locomotive Scroll
- Initialize `locomotive-scroll` within a custom hook or the main `App` component.
- Apply `data-scroll-container` to the main wrapper.
- Use `data-scroll`, `data-scroll-speed`, and other attributes to recreate the parallax and smooth scrolling effects from the original site.

### 7. Image Optimization
- Configure `vite-plugin-image-optimizer` in `vite.config.ts` to automatically optimize images during the build process.
- Use standard `<img>` tags or a lightweight React wrapper for optimized loading (e.g., lazy loading by default).

### 8. Verification & Build
- Run `oxlint` and `oxfmt` to ensure code quality and consistency.
- Verify responsiveness at the original breakpoints (760px and 1080px).
- Execute `pnpm build` to generate the static website in the `dist` folder.
- Preview the build locally to ensure all animations and styles are preserved.
