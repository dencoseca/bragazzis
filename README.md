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

- `?preset=gallery` for the Il Giorno gallery, with widths up to the 1500px originals for its `34vw` to full-bleed desktop placements and
  full-width mobile layout.
- `?preset=editorial` for medium editorial and story images.
- `?preset=fullWidth` for full-bleed hero/banner images.

The imagetools cache lives at `node_modules/.cache/imagetools`. CI restores and saves that cache for build checks so
repeated image transforms stay fast.
