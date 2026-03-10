# Improvement Plan

> **Usage:** Open a new agent session and prompt:
> _"Please execute phase N of @file:improvement-plan.md and mark it complete"_
>
> Each phase is self-contained and ordered by priority. Complete them in sequence.

---

## Phase 1 — Quick Wins: Metadata, Cleanup & 404 Page `[x]`

These are small, independent fixes that immediately improve the project's polish.

### 1a. Fix `index.html` Metadata

The `<title>` in `index.html` is still set to **"tmp-vite"** — the default from project scaffolding. While `react-helmet-async` overrides this per page, the fallback title (visible during loading or if JS fails) should be updated to **"Bragazzi's"**.

Also add:

- A proper `<meta name="description">` tag.
- Open Graph / social media meta tags for link previews.
- A proper favicon (replace the default Vite one).

### 1b. Remove Unused Files

Delete these unused remnants from the Vite scaffold or earlier iterations:

- `src/App.css` — empty or unused (styles are in SCSS).
- `src/index.css` — empty or unused (styles are in SCSS via `main.scss`).
- `src/components/Example.module.scss` — not imported anywhere.
- `public/vite.svg` — default Vite favicon, not referenced.

### 1c. Add 404 / Catch-All Route

There is a `_404.scss` stylesheet but no corresponding 404 page component or catch-all route in `App.tsx`. If a user navigates to an unknown URL, they see a blank page.

Create a `NotFound.tsx` page and add a catch-all route:

```tsx
<Route path="*" element={<NotFound />} />
```

### Done Criteria

- [x] `index.html` has correct title, meta description, OG tags, and favicon
- [x] All four unused files are deleted
- [x] A `NotFound` page exists and is rendered for unknown routes
- [x] App builds successfully (`pnpm build`)

---

## Phase 2 — Code Splitting & Lazy Loading Routes `[x]`

All three page components (`Home`, `LaStoria`, `IlGiorno`) are eagerly imported in `App.tsx`. Since each page imports many large images, this means every image for every page is included in the initial bundle.

### Tasks

- Lazy-load all page components using `React.lazy()` and `Suspense`:

```tsx
import { lazy, Suspense } from "react";

const Home = lazy(() => import("@/pages/Home"));
const LaStoria = lazy(() => import("@/pages/LaStoria"));
const IlGiorno = lazy(() => import("@/pages/IlGiorno"));

// Wrap routes in <Suspense fallback={<LoadingSpinner />}>
```

- Create a simple loading fallback component if one doesn't exist.
- Ensure each page is split into its own chunk (verify with `pnpm build` output).

### Done Criteria

- [x] Page components are lazy-loaded via `React.lazy`
- [x] Routes are wrapped in `<Suspense>` with a fallback
- [x] Build output shows separate chunks per page
- [x] App builds and runs successfully

---

## Phase 3 — Accessibility `[x]`

### Tasks

- **`Header.tsx`** — the mobile menu toggle is a `<div onClick={...}>`. Replace with a `<button>` element with `aria-label="Toggle menu"` and `aria-expanded={menuIsOpen}` so screen readers and keyboard users can operate it.
- **`Cover.tsx`** — the opening hours list uses `openingHours.map` to render `<p>` tags. Change to a `<ul>` / `<li>` list or a `<dl>` (definition list) for day/time pairs.
- **Add a skip-to-content link** — add a mechanism for keyboard users to skip past the header/navigation to the main content.
- **Colour contrast** — verify the light text (`#f6f4f1`) on image backgrounds meets WCAG AA contrast ratios using axe or Lighthouse. Fix any failures.

### Colour Contrast Findings

- `#f6f4f1` on `#1d1d1d` — **15.36:1** ✅ (WCAG AA requires 4.5:1 for normal text, 3:1 for large text)
- `#f6f4f1` on `#000000` — **19.13:1** ✅
- Text overlaid on dark photographic image backgrounds comfortably exceeds WCAG AA for large text (3:1). The hero title "BRAGAZZI'S" and cover content text are rendered at large display sizes.
- No contrast failures found.

### Done Criteria

- [x] Mobile menu toggle is a `<button>` with proper ARIA attributes
- [x] Opening hours rendered with semantic list markup
- [x] Skip-to-content link is present and functional
- [x] Colour contrast has been checked (document any findings)
- [x] App builds successfully

---

## Phase 4 — Image Optimisation `[x]`

The `src/assets/images/` directory contains 66 images, most of which are JPEGs between 1–2.4 MB each. Even with `vite-plugin-image-optimizer` compressing them at build time, they remain in JPEG format and are very large for a web project.

### Tasks

- **Convert images to modern formats (WebP / AVIF)** — the existing `vite-plugin-image-optimizer` already has config entries for `webp` and `avif`, so this is partly in place. Serve images as `<picture>` elements with format fallbacks.
- **Resize images to the maximum dimensions they are actually displayed at** — provide 2× variants for retina displays and nothing more.
- **Add lazy loading** — use `loading="lazy"` on `<img>` tags that are below the fold.
- **Consider a CDN or external image service** — hosting 66 large images inside the Git repo inflates clone size. A service like Cloudinary, imgix, or an S3 bucket with a CDN would keep the repo lean and allow on-the-fly format/size transformations. _(Document a recommendation even if not implemented in this phase.)_

### CDN / Image Service Recommendation

Hosting 66 large images inside the Git repository inflates clone size significantly. For a production deployment, consider migrating images to an external image service:

- **Cloudinary** (recommended) — free tier covers small projects; supports automatic format negotiation (WebP/AVIF), on-the-fly resizing via URL parameters, and a global CDN. This would eliminate the need for the local `optimize-images` script and the checked-in WebP files.
- **imgix** — similar CDN-based transformation pipeline; better suited if images are already hosted on S3 or GCS.
- **S3 + CloudFront** — more manual setup but full control; pair with a Lambda@Edge function for automatic format conversion.

Any of these would keep the repo lean (< 10 MB vs ~100 MB currently) and allow on-the-fly format/size transformations without a build step.

### Done Criteria

- [x] Images served via `<picture>` elements with WebP fallbacks (via `OptimizedImage` component and `imageMap` utility)
- [x] Images resized to appropriate display dimensions (max 1920px / 2× retina via `scripts/optimize-images.mjs`)
- [x] Below-the-fold images use `loading="lazy"` (hero/cover images use `loading="eager"`)
- [x] CDN/image service recommendation documented (see above)
- [x] App builds successfully

---

## Phase 5 — Shared Constants & DRY Code `[x]`

### Tasks

- **Extract `smoothTransition`** — it is defined separately in both `Cover.tsx` and `Header.tsx` with slightly different values. Extract into a shared animation constants file (e.g. `src/constants/animations.ts`) to keep motion config DRY.
- **Evaluate breakpoints/dimensions prop drilling** — breakpoints and dimensions are passed as props through the component tree (e.g. `Cover` receives `dimensions` and `breakpoints`). Consider using CSS media queries or a shared context/hook for responsive logic instead of manual `width >= mobile` checks in JS. _(Implement or document recommendation.)_

### Animation Constants

Created `src/constants/animations.ts` with three shared transition presets extracted from four components:

- **`smoothTransition`** (duration 1.1s) — used by `Cover.tsx` and `LaStoria.tsx` for page-level entrance animations.
- **`quickTransition`** (duration 0.6s) — used by `Header.tsx` for the hamburger menu toggle.
- **`menuSlideTransition`** (duration 0.6s, different ease curve) — used by `Menu.tsx` for slide and link animations.

All four components (`Cover.tsx`, `Header.tsx`, `Menu.tsx`, `LaStoria.tsx`) now import from the shared file instead of defining local constants.

### Breakpoints / Dimensions Evaluation

The current approach defines `breakpoints` and `dimensions` in `Home.tsx` and passes them as props to `Cover`, `FloatingItems`, and `FullWidthBanner`. This pattern exists because:

1. **`dimensions` must be JS-based** — the components use `dimensions.vh` and `dimensions.width` for Framer Motion `useTransform` calculations (e.g. parallax scroll offsets) and conditional JS logic. CSS media queries cannot replace this since the values feed into JS animation math, not just styling.
2. **`breakpoints` gate JS behaviour, not just layout** — e.g. `Cover` decides which scroll target to use based on `width >= mobile`, and `Home` skips the resize listener on mobile entirely.
3. **The prop drilling is shallow** — only one level deep (`Home` → child components), so the overhead is minimal and a React Context or custom hook would add complexity without meaningful benefit at this scale.

**Recommendation:** Keep the current approach. The prop drilling is shallow, the values drive JS logic (not just CSS layout), and introducing a context/hook would be over-engineering for three consumers. If more components need responsive JS logic in the future, extract a `useViewport` hook at that point.

### Done Criteria

- [x] `smoothTransition` extracted to a shared constants file and imported in both components
- [x] Breakpoints approach evaluated (improved or recommendation documented)
- [x] App builds successfully

---

## Phase 6 — README & Documentation `[ ]`

The `README.md` contains only the text "# bragazzis" — it provides no useful information.

### Tasks

Expand `README.md` to include:

- A brief project description.
- Prerequisites (Node.js version, pnpm).
- Setup instructions (`pnpm install`, `pnpm dev`).
- Available scripts and what they do.
- Deployment notes.

### Done Criteria

- [ ] README contains all five sections listed above
- [ ] Information is accurate (verify scripts from `package.json`)

---

## Phase 7 — Styling Organisation & Locomotive Scroll Evaluation `[ ]`

### 7a. Co-locate or Consolidate Styling Approach

Styles are split between `src/styles/components/` (SCSS partials with BEM naming) and component files in `src/components/`. There is also an unused `Example.module.scss` suggesting CSS modules were considered.

Pick one approach and commit to it:

- **Option A (SCSS modules):** Co-locate `.module.scss` files alongside their components (e.g. `Cover.module.scss` next to `Cover.tsx`). This improves locality and avoids style leakage.
- **Option B (Global SCSS):** Keep the current approach but document the convention and ensure the `src/styles/` structure mirrors the component structure clearly.

Either way, remove the unused `Example.module.scss` (if not already removed in Phase 1).

### 7b. Evaluate Locomotive Scroll

`locomotive-scroll` (v5) is installed and initialised in a custom hook, but it's being used with default options and no `data-scroll` attributes are visible on elements. If the only goal is smooth scrolling, this library adds significant bundle weight for little benefit — CSS `scroll-behavior: smooth` or the existing `scrollIntoView({ behavior: "smooth" })` calls already handle this.

Evaluate whether locomotive-scroll is actually providing value. If not, remove it to reduce bundle size and complexity.

### Done Criteria

- [ ] Styling approach decision made and implemented (or documented)
- [ ] `Example.module.scss` removed (if still present)
- [ ] Locomotive scroll evaluated — removed if unnecessary, or justified if kept
- [ ] App builds successfully

---

## Progress Tracker

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Quick Wins: Metadata, Cleanup & 404 | ✅ Complete |
| 2 | Code Splitting & Lazy Loading Routes | ✅ Complete |
| 3 | Accessibility | ✅ Complete |
| 4 | Image Optimisation | ✅ Complete |
| 5 | Shared Constants & DRY Code | ✅ Complete |
| 6 | README & Documentation | ⬜ Not started |
| 7 | Styling Organisation & Locomotive Scroll | ⬜ Not started |
