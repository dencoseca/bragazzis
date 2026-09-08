# AGENTS.md

Instructions for AI agents working on the Bragazzi's website codebase.

## Project Overview

This is the website for **Bragazzi's**, an Italian deli and café in Sheffield. It is a single-page-style React
application with multiple routes, built with **React 19**, **TypeScript**, and **Vite**.

## Tech Stack

- **Runtime/Framework:** React 19, React Router 7, TypeScript 7.0
- **Build Tool:** Vite 8 (managed via Vite+)
- **Styling:** Sass/SCSS (no CSS modules — global styles in `src/styles/`)
- **Animation:** Motion (Framer Motion), Lenis (smooth scroll)
- **SEO:** React 19 native document metadata
- **Image Optimization:** vite-imagetools (build-time responsive AVIF/JPEG fallback generation via sharp)
- **Visual Testing:** Playwright visual regression tests (Chromium only)

## Project Structure

```
src/
├── assets/            # Static assets
│   ├── fonts/         # Project fonts (ttf, woff2, etc.)
│   └── images/        # Static image assets (jpg, png, svg — high-quality originals)
├── components/        # Shared React components, with site shell/navigation under components/layout/
├── constants/         # Shared TypeScript constants (animations.ts, siteConfig.ts, etc.)
├── hooks/             # React hooks shared across routes (useSmoothScroll, useMediaQuery)
├── pages/             # Route-level pages and their feature-local components/data (for example pages/home/)
├── styles/            # Global SCSS files
│   ├── components/    # Component-specific SCSS partials
│   ├── pages/         # Page-specific SCSS partials
│   ├── main.scss      # Entry point that imports all partials
│   ├── _tokens.scss
│   ├── _themes.scss
│   ├── _typography.scss
│   └── _normalize.scss
├── types/             # TypeScript type definitions (imagetools.ts, etc.)
├── App.tsx            # Router setup
└── main.tsx           # App entry point
```

- **Path alias:** `@` maps to `src/` (configured in `vite.config.ts` and `tsconfig.json`). In application code under
  `src/`, use `@/` imports for other source files. Preserve relative imports in root configuration files.
- **Config files:** `vite.config.ts`, `vite.imagetools.ts`, `tsconfig.json`

## Code Style & Conventions

- **Follow existing patterns.** Match the style of surrounding code — naming, formatting, file organization.
- **TypeScript:** Strict mode. Do not use `any` — prefer explicit types or `unknown`. All files use `.ts` or `.tsx`
  extensions.
- **Imports:** In application code under `src/`, use the `@/` path alias for other source files. Example: `import { OptimizedImage } from "@/components/OptimizedImage"`.
- **Components:** Functional components only. Use named exports for everything (components, hooks, types, interfaces).
- **Feature colocation:** Keep page-specific components beside their route under `src/pages/<feature>/`; reserve
  `src/components/` for components shared across routes.
- **Hooks:** Prefix with `use`. Hooks shared across routes live in `src/hooks/`; a hook used by a single feature is
  colocated with it (for example `src/pages/home/useScrollParallax.ts`), and moves to `src/hooks/` when a second route
  needs it.
- **Styles:** SCSS partial filenames use kebab case and match their owning component or page feature (for example,
  `_footer.scss`, `_la-storia.scss`, `_il-giorno.scss`, and `_error-page.scss`). Import new partials into
  `src/styles/main.scss`.
- **Constants:** Shared TypeScript values go in `src/constants/`. Visual design tokens, theme colors, and breakpoints
  live in `src/styles/_tokens.scss`; `vite.config.ts` injects Sass breakpoint values into JavaScript at build time.
- **Images:** Keep high-quality `.jpg` originals in `src/assets/images/`; do not overwrite or resize them. Use the
  named `vite-imagetools` presets from `vite.imagetools.ts` (`?preset=gallery`, `?preset=editorial`, or
  `?preset=fullWidth`) to generate responsive AVIF/JPEG fallback variants at build time. Use the shared
  `OptimizedImage` component for rendering images where possible. Il Giorno gallery originals live in
  `src/assets/images/gallery/`; its wildcard import and build-time metadata parity check depend on that directory
  containing only gallery `.jpg` files. Existing `.webp` files are not source assets and should not be imported
  directly.
- **Image loading:** `OptimizedImage.shouldLoad` gates real sources; `loading` independently controls urgency and
  defaults to lazy. `priority` forces eager/high-priority loading only when eligible. The gallery explicitly opts into
  eager loading for its observer-driven load-ahead. Failed images show a local accessible fallback and report through
  picture `onError`; `onReady` is reserved for successful loads. See `docs/image-loading.md` for measured behaviour.

## GitHub Workflow

- **Start issue branches from an up-to-date `main`.** Before branching from `main`, fetch the latest remote changes and
  fast-forward or pull `main`.
- **Raise pull requests as ready for review.** Do not create draft PRs unless the user explicitly asks for a draft.
- **Use squash merges only when merging pull requests.** Merge commits are not allowed in this repository.
- **Close completed issues from PR descriptions.** When a pull request completes one or more GitHub issues, include a
  closing keyword for each issue in the PR description, such as `Closes #3`.

## Key Architecture Notes

- **No SSR** — this is a client-side SPA, but browser-dependent hooks include `typeof window` guards for SSR-safety as
  a best practice.
- **Routing** is handled by React Router in `src/App.tsx` with lazy-loaded page components. Pages use named exports; `App.tsx` maps them to default exports for `React.lazy`.
- **Route failures** are caught around route content by `RouteErrorBoundary`. Its standalone recovery screen shares `ErrorPage` and its styles with the 404 page. Recovery uses an explicit full-page reload because rejected lazy imports are cached; changing pathname resets the boundary so the home link remains usable. Keep the shared Suspense boundary and its loading behavior unchanged.
- **Smooth scrolling** is powered by Lenis via the `useSmoothScroll` hook, used in `components/layout/Layout.tsx`; history-entry changes reset its momentum.
- **Route navigation** is coordinated by `components/RouteNavigation.tsx` inside the shared route Suspense boundary: new page links start at the top (or their fragment target), and focus moves after lazy content is ready. Every route supplies a focusable `main#main-content`. Back/Forward scroll restoration and native fragment scrolling are browser-managed; exact positions are not guaranteed across asynchronous layout changes. Do not add custom history state or scroll-position tracking for this policy.
- **Responsive JS behavior** uses the Sass-backed media-query helpers in `useMediaQuery`; viewport-relative Motion
  transforms use CSS units directly so resizing does not require React state.
- **Home motion:** `Home.tsx` keeps one `useScroll()` subscription for the hero photograph. Its restrained parallax is
  disabled on mobile and under reduced motion by `src/pages/home/useScrollParallax.ts`. Editorial and seasonal sections
  use normal document flow without scroll transforms.
- **Visual direction:** butter-yellow paper, vermilion and dark green ink are defined in Sass tokens. The masthead uses
  the existing Abril Fatface font; editorial headings use Georgia and body copy uses the system sans-serif stack.
  Home is an editorial grid, La Storia pairs the original story with archival tickets, and Il Giorno presents 26 selected photographs in their original day-to-night order, using a continuous grid of pairs and three-photo compositions with uniform gutters, ending with the empty café alone.
- **Themes** are semantic in React (`data-theme="light"` / `data-theme="dark"`) and mapped to actual colors in Sass.
- **Breakpoints** are owned by Sass tokens in `src/styles/_tokens.scss`; `vite.config.ts` injects their values at build
  time for `src/constants/breakpoints.ts`, so JavaScript never mirrors the numbers in TypeScript.

## Efficient Iteration and Validation

- **Match effort to the change.** During colour, spacing, or other small design experiments, edit the smallest
  relevant surface and inspect it in the existing dev preview. Defer production builds, screenshot baseline updates,
  and full suites until the user settles on a version. Do not turn each preview into a release-validation cycle.
- **Documentation-only changes:** review the diff and run `git diff --check`; application builds and tests are unnecessary.
- **Final, isolated styling changes:** run `vp check` and the affected visual tests. For example,
  `vp run test:visual --grep 'ilgiorno'` covers Il Giorno at the configured viewport sizes. Include other routes or
  menu states when shared selectors affect them. Colour-only changes do not require rerunning unit tests.
- **Behaviour, shared layout, routing, image loading, or toolchain changes:** run `vp check`, `vp test`, and
  `vp run build`; run the full visual suite when the change affects rendering or browser behaviour across the site.
- **Reuse valid results.** Keep track of which source version and scope passed. After a small follow-up change,
  repeat only the affected checks unless a failure or new risk justifies broader validation. Committing or pushing
  unchanged, already-validated code does not require another test cycle.
- **Avoid stale production previews.** Playwright may reuse an existing server on port 4173. If it is serving an
  older build, rebuild once before the visual run; if Playwright starts its own server, its configuration builds for you.
- **Keep tool output focused.** Reuse source already read; request narrow CodeGraph queries and file excerpts.
  Save verbose build/test logs and inspect summaries or failure details. Review a representative screenshot for a
  preview and the changed screenshots before committing baselines; avoid repeatedly emitting full-page images.
- **Wait efficiently.** Use bounded waits of up to 30 seconds for running commands instead of repeated short polls.
  Give concise updates when there is meaningful progress, while maintaining the required communication cadence.

## Visual Regression Troubleshooting

- When `vp run test:visual` fails, do not update baselines automatically. Treat baseline updates as approval of an
  intentional visual change.
- Inspect the Playwright output in `test-results/` and `playwright-report/` to compare expected, actual, and diff
  images.
- Decide whether the difference is an intentional visual change or an unintended regression.
- If it is a regression, fix the source code, styles, or assets and rerun the affected checks using the scope above.
- If the visual change is intentional and settled, update only affected baselines, for example
  `vp run test:visual:update --grep 'ilgiorno'`, then review the changed PNGs before committing them. A successful
  update run plus image review does not itself require an identical second run without source changes.
- Do not loosen screenshot thresholds or add broad waits unless the failure is proven to be nondeterministic rendering
  noise.
- CI runs on Linux with centralized Chromium baselines. Local macOS runs may differ slightly, so CI diffs should be
  treated as the source of truth when platform rendering differences appear.
- `vp run test:visual` runs the complete local Playwright suite. CI uses `vp run test:visual:ci`, which excludes tests
  tagged `@local-only` when their browser input emulation is not portable to Linux.
- Do not commit `playwright-report/` or `test-results/`; only commit intentional baseline images under
  `tests/visual/__screenshots__/`.

## Important Warnings

- **Do NOT add `"use client"` directives.** This is not a Next.js project.
- **Do NOT introduce CSS-in-JS or CSS modules.** The project uses global SCSS with a partial-based architecture.
- **Do NOT overwrite, resize, or re-encode `.jpg` originals** in `src/assets/images/`. Responsive variants are generated
  at build time by `vite-imagetools` using the named presets in `vite.imagetools.ts`.
- **Keep bundle size in mind.** Lazy-load routes (already done in `App.tsx`) and avoid large eager imports.
- **No default exports, except configuration files.** The project enforces named exports via linting, with explicit
  exceptions for `vite.config.ts` and `playwright.config.ts`; preserve their default exports.
- **Keep AGENTS.md updated.** After finishing a task, update this file if any of your changes make its current content invalid or outdated.

<!--VITE PLUS START-->

## Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Common Pitfalls

- **Running scripts:** Vite+ built-in commands (`vp lint`, `vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool. Use `vp run <script>` to run `package.json` scripts or tasks defined in `vite.config.ts`
- **Do not manage Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ owns these tool versions. Do not
  install or upgrade them by hand; use Vite+ commands so its pins, catalogs, and overrides stay aligned.
- **Import JavaScript modules from `vite-plus`:** Import modules from the `vite-plus` dependency, not from
  `vite` or `vitest`. For example, `import { defineConfig } from 'vite-plus';` or
  `import { expect, test, vi } from 'vite-plus/test';`. Do not add `vitest` just to import test utilities;
  `vp migrate` owns any required Vitest pin.

### Upgrading Vite+

- For existing Vite+ projects, prefer `vp migrate` when upgrading the local Vite+ toolchain. It repins
  `vite-plus`, the `vite` alias, Vitest, pnpm catalogs/overrides, and peer dependency rules according to the
  current global `vp`.
- After `vp migrate`, run `vp install`, `vp check`, `vp test`, and `vp run build`. The build script runs `tsc && vp build`
  for full build validation. Run `vp run test:visual` when
  changing layout, typography, imagery, animation, or scroll behavior.
- In Codex/non-TTY environments, if `vp migrate` updates files but its internal install fails with a pnpm
  confirmation prompt, rerun install with `env CI=true vp install --no-frozen-lockfile`.

### Codex Sandbox Note

When starting the local dev server in Codex, `vp dev --host 127.0.0.1` may fail with `listen EPERM` because binding a localhost port requires approval. If that happens, rerun the same command with escalated permission rather than changing the host, port, or dev tooling.

### Review Checklist

- [ ] Run `vp install` when dependencies or the lockfile change, or dependencies are missing.
- [ ] Choose checks using **Efficient Iteration and Validation** above; previews and documentation edits do not need full suites.
- [ ] Confirm passing results apply to the final changed code and inspect any intentional screenshot updates.
- [ ] Report what was checked accurately; do not imply a full suite ran when only focused checks ran.

- Docs: https://viteplus.dev/guide/

<!--VITE PLUS END-->
