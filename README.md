# Bragazzi's

The website for **Bragazzi's** — an Italian deli, café and cultural hub in Edinburgh. Built with React, TypeScript and Vite.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [pnpm](https://pnpm.io/) v10 (the project enforces pnpm via a `preinstall` check)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The dev server will start at `http://localhost:5173` by default.

## Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start the Vite development server with HMR |
| `pnpm build` | Type-check with TypeScript and build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint with auto-fix |
| `pnpm format` | Format all files with Prettier |
| `pnpm typecheck` | Run the TypeScript compiler without emitting (type-check only) |
| `pnpm optimize-images` | Resize and convert source images to WebP using Sharp |

## Deployment

Running `pnpm build` outputs a static site to the `dist/` directory. This can be deployed to any static hosting provider:

- **Vercel / Netlify** — connect the repository and set the build command to `pnpm build` with `dist` as the publish directory.
- **GitHub Pages / S3 + CloudFront** — upload the contents of `dist/`.

Since the app uses client-side routing (React Router), configure the hosting provider to serve `index.html` for all paths (SPA fallback / rewrite rule).
