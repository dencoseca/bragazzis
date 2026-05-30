# Bragazzi's

The website for **Bragazzi's** — an Italian deli and café in Sheffield. Built with React, TypeScript, Sass, and Vite+.

[![Netlify Status](https://api.netlify.com/api/v1/badges/51f1d932-d3d1-40a4-a04c-7c366b4ebaa9/deploy-status)](https://app.netlify.com/projects/epic-nightingale-e4e9e2/deploys)

## Development

This project uses Vite+, so run the built-in `vp` commands directly and use `vp run <script>` for scripts defined in
`package.json`.

Install dependencies:

```sh
vp install
```

Start the local development server:

```sh
vp dev
```

Run formatting, linting, and type checks:

```sh
vp check
```

Run the unit and smoke test suite:

```sh
vp test
```

Build the production site:

```sh
vp run build
```

Preview a production build locally:

```sh
vp preview
```

Check for package updates:

```sh
vp outdated
```

Apply dependency updates:

```sh
vp update --latest
```

## Images

High-quality source images live in `src/assets/images`. Keep the `.jpg` originals intact; responsive AVIF, WebP, and
fallback variants are generated at build time through `vite-imagetools` and `sharp`.

## Visual Regression Tests

Run the Chromium-only Playwright visual suite with:

```sh
vp run test:visual
```

The Playwright web server builds the production app with `vp run build` and serves it with `vp preview`, so screenshots are taken against production output rather than the Vite dev server. Baselines live in `tests/visual/__screenshots__`.

When an intentional visual change is made, update baselines with:

```sh
vp run test:visual:update
```

The suite centralizes Chromium baselines instead of generating separate macOS and Linux snapshots. `playwright.config.ts` uses one Chromium project, `deviceScaleFactor: 1`, sRGB color, and Chromium font-rendering flags (`--font-render-hinting=none`, `--disable-font-subpixel-positioning`, and `--disable-lcd-text`) to reduce platform noise. Local macOS runs can still differ slightly from Linux CI, so the screenshot thresholds are intentionally tolerant of small antialiasing differences while still catching layout, typography, image composition, and scroll-state regressions. No requested rendering stability flags are currently omitted.
