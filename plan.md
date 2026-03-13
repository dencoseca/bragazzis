# SEO & Search Appearance Improvement Plan

> **Project:** Bragazzi's website (React + Vite SPA)
> **Date:** 2026-03-13

---

## 1. Add `robots.txt` and XML Sitemap

- [ ] Create `public/robots.txt` allowing all crawlers and pointing to the sitemap:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://bragazzis.co.uk/sitemap.xml
  ```
- [ ] Create `public/sitemap.xml` listing all public pages (`/`, `/lastoria`, `/ilgiorno`) with `<lastmod>` dates.

## 2. Add Canonical URLs

- [ ] In `Layout.tsx`, use `react-helmet-async` to inject a `<link rel="canonical">` tag based on the current route so every page declares its canonical URL.
  ```tsx
  <Helmet>
    <link rel="canonical" href={`https://bragazzis.co.uk${location.pathname}`} />
  </Helmet>
  ```

## 3. Improve Per-Page Meta Tags

- [ ] Extend the `Layout` component (or each page) to accept and render a unique `<meta name="description">` per page instead of relying solely on the fallback in `index.html`.
- [ ] Add unique Open Graph (`og:title`, `og:description`, `og:url`) and Twitter Card meta tags per page via Helmet so each page has tailored social previews.

## 4. Add Structured Data (JSON-LD)

- [ ] Add a `<script type="application/ld+json">` block (via Helmet or directly in `index.html`) with **LocalBusiness** schema markup including:
  - Business name, description, address, phone, opening hours
  - Logo and image
  - `sameAs` links to social profiles
  - Geo coordinates
- [ ] Validate the structured data using [Google's Rich Results Test](https://search.google.com/test/rich-results).

## 5. Handle SPA Routing for Crawlers

- [ ] Since this is a client-side rendered SPA, confirm that the hosting platform (e.g. Netlify, Vercel) is configured to serve `index.html` for all routes (SPA fallback) so crawlers don't get 404s.
- [ ] Consider adding a pre-rendering solution (e.g. `vite-plugin-prerender` or a serverless SSR approach) so crawlers receive fully rendered HTML for each page.

## 6. Miscellaneous SEO Hygiene

- [ ] Add a `<meta name="theme-color">` tag to `index.html` matching the brand colour for better mobile browser presentation.
- [ ] Add `<html lang="en">` (already present ✓) — verify it stays correct.
- [ ] Create Apple Touch Icon (`public/apple-touch-icon.png`) and add the corresponding `<link>` tag for iOS home-screen bookmarks.
- [ ] If not already present, add a `<link rel="manifest">` pointing to a `site.webmanifest` for PWA-like appearance in search results.

---

### Priority Order

| Priority | Task | Impact |
|----------|------|--------|
| 🔴 High | 1 — robots.txt & sitemap | Crawlability |
| 🔴 High | 4 — Structured data (JSON-LD) | Rich results in Google |
| 🟠 Medium | 3 — Per-page meta tags | Click-through rate |
| 🟠 Medium | 2 — Canonical URLs | Duplicate content prevention |
| 🟠 Medium | 5 — SPA pre-rendering | Indexability |
| 🟡 Lower | 6 — Misc hygiene | Polish |
