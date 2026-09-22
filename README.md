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

High-quality source images live in `src/assets/images`. Keep the `.jpg` originals intact; responsive AVIF and JPEG
fallback variants are generated at build time through `vite-imagetools` and `sharp`.

Image imports use named presets configured in `vite.imagetools.ts` instead of long raw transform query strings:

- `?preset=gallery` for the Il Giorno gallery, with widths tuned for the real `40vw` to `70vw` desktop layout and
  full-width mobile layout.
- `?preset=editorial` for medium story and editorial images.
- `?preset=fullWidth` for full-bleed hero/banner images.

The imagetools cache lives at `node_modules/.cache/imagetools`. CI restores and saves that cache for both build checks
and browser test runs so repeated image transforms stay fast.

## Browser checks

Pull requests run lint, type checks, unit tests, the production build, and functional Chromium tests.
Screenshot comparisons are optional and do not run on pull requests.

```sh
vp run test:browser
```

This covers navigation, menu focus and scrolling, image failure recovery, route recovery, and targeted
section-overlap checks. CI uses `vp run test:browser:ci`, which also excludes the local-only touch-emulation case.
The Playwright web server runs `vp run build` and serves the production output with `vp preview`.

For UI changes, inspect the affected pages at relevant viewport sizes and report what was checked.
Use screenshot comparisons when they would help assess an unintended visual change:

```sh
vp run test:visual
```

To run screenshots on GitHub, manually dispatch **Browser checks** with **Also run optional screenshot comparisons**
enabled. The job retains its historical **Chromium visual tests** check name for branch-protection compatibility.

Screenshot suites are tagged `@screenshot`; keep that tag on any new baseline comparisons so they remain optional.
Baselines stay in `tests/visual/__screenshots__/`. Update them only after reviewing intentional changes:

```sh
vp run test:visual:update
```

`vp exec playwright test` runs both suites together. The shared Chromium configuration uses a device scale of 1,
sRGB, and font-rendering flags to reduce platform noise. Local macOS screenshots can still differ from Linux;
inspect differences instead of automatically accepting them. Optional baselines may need review after design changes.
