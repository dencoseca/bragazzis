# Repository rules

## Code and assets

- Use `@/` imports for source files under `src/`; keep relative imports in root configuration files.
- Use named exports; `vite.config.ts` is the default-export exception. Avoid TypeScript `any`.
- Colocate page-specific components, hooks, and data under `src/pages/<feature>/`. Put code shared
  across routes in `src/components/`, `src/hooks/`, or `src/constants/` as appropriate.
- Use global SCSS, with kebab-case partials imported by `src/styles/main.scss`. Do not introduce
  CSS modules or CSS-in-JS. Keep design tokens and breakpoints in `src/styles/_tokens.scss`;
  use the existing breakpoint helpers in JavaScript rather than duplicating values.
- Never overwrite, resize, or re-encode original `.jpg` assets. Use the presets in
  `vite.imagetools.ts` and the shared `OptimizedImage` component. Do not import generated `.webp`
  files as source assets. Keep `src/assets/images/gallery/` limited to gallery `.jpg` originals.
- Keep routes lazy-loaded and give each page a focusable `main#main-content`. Leave Back/Forward
  scroll restoration to the browser; do not add custom history state or scroll-position tracking.

## Tooling and validation

- Use Vite+ (`vp`). Run package scripts with `vp run <script>`; built-in commands such as
  `vp build` do not run the corresponding package script.
- Import tooling APIs from `vite-plus` and test APIs from `vite-plus/test`. Use `vp migrate`
  for toolchain upgrades; do not independently manage its bundled Vitest, Oxlint, Oxfmt, or tsdown.
- Run `vp install` after pulling changes. For code changes, run `vp check`, `vp test`, and
  `vp run build` (which includes the explicit TypeScript check).
- Verify visual, animation, and scrolling changes in a browser at mobile, tablet, and desktop widths.

## GitHub workflow

- Start new issue branches from an up-to-date `main`.
- Open PRs ready for review unless a draft is requested. Include `Closes #<issue>` for each
  issue completed by the PR.
- Use squash merges only.

Keep this file limited to actionable repo rules. Put implementation explanations in code comments
or `docs/`; update these rules when they become outdated.
