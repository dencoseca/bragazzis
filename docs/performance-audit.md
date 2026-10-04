# Performance and maintainability audit

Audit date: 4 October 2026. Baseline: `0224f67` on up-to-date `main`.
Review branch: `audit/performance-maintainability`; audit and review performed locally.

## Scope and decisions

Inspected the React 19 / React Router application, route metadata and error recovery,
shared navigation and image component, all page components and motion hooks, global
SCSS and breakpoint tokens, the imagetools presets and gallery validation, dependencies,
production output, tests, and CI. The baseline passed checks, all 8 tests, and the
TypeScript-inclusive production build. No pre-existing worktree changes were present.
CodeGraph was consulted before locating and reading implementation code.

The image pipeline already emits responsive AVIF/JPEG pictures, preserves original
JPEGs, separates eligibility from native lazy loading, and uses a cached transform
pipeline. Reveal observers and navigation listeners already clean up on unmount;
no demonstrated listener leak was found. Dependencies were not upgraded.

| Priority | Problem and evidence                                                                                                   | Change and verification                                                                                                                                                                                                         | Risk / effort                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 1        | All six animated components import the complete Motion component factory, including unused drag and layout features.   | Use `m` with synchronous `LazyMotion` / `domAnimation`. Compare production bytes, screenshots, native animation configuration, scroll and menu interactions.                                                                    | Low to medium / small; verify every animation consumer. |
| 2        | Each gallery eligibility update renders all 49 figures; loading observers continue observing already eligible targets. | Memoize only `GalleryFigure`'s two primitive props, batch each observer delivery to its furthest index, and unobserve intersecting targets. Count actual production renders and observer entries; test eligibility and cleanup. | Low / small; eligibility must remain monotonic.         |
| 3        | CI invokes `vp build`, bypassing the `build` package script used for local production verification.                    | Invoke `vp run build`, making `package.json` the shared build definition, including its explicit TypeScript check.                                                                                                              | Low / one-line change.                                  |

## Implementation and maintainability evidence

- [src/main.tsx](../src/main.tsx) owns the Motion feature policy once. Synchronous
  features preserve immediate animation availability; `strict` rejects accidental
  eager Motion components in development. `m` replaces `motion` in
  [Header](../src/components/layout/Header.tsx), [Menu](../src/components/layout/Menu.tsx),
  [LaStoria](../src/pages/LaStoria.tsx), [HomeHero](../src/pages/home/HomeHero.tsx),
  [HomeSeasonal](../src/pages/home/HomeSeasonal.tsx), and
  [HomeShopfront](../src/pages/home/HomeShopfront.tsx). Animation variants, transitions,
  reduced-motion policy, parallax hooks and DOM structure are unchanged.
- [IlGiornoGallery](../src/pages/il-giorno/IlGiornoGallery.tsx) retains ownership of its
  observer and eligibility boundary. One state updater per intersecting batch replaces
  an updater per entry. The same two initial images, three-image load-ahead, 1,200 px
  margin, eager loading, order, sizes and alternative text are retained. Memoization
  is limited to the measured repeated-list hotspot; no custom equality or new abstraction.
- [.github/workflows/build.yml](../.github/workflows/build.yml) now uses the existing
  package script instead of maintaining a second build command. No new dependency,
  route, stylesheet, image preset or image asset was introduced.

## Measurements

All browser figures below compare the **final** implementation with the baseline.

| Metric                                     |  Before |   After | Absolute change | Change |
| ------------------------------------------ | ------: | ------: | --------------: | -----: |
| Entry JavaScript, raw B                    | 417,031 | 371,786 |         -45,245 | -10.8% |
| Entry JavaScript, gzip B                   | 133,340 | 120,541 |         -12,799 |  -9.6% |
| Entry JavaScript, Brotli B                 | 115,020 | 104,270 |         -10,750 |  -9.3% |
| Cold `/` JS response bodies, B             | 133,340 | 120,541 |         -12,799 |  -9.6% |
| Cold `/lastoria` JS response bodies, B     | 134,809 | 122,008 |         -12,801 |  -9.5% |
| Cold `/ilgiorno` JS response bodies, B     | 142,559 | 129,801 |         -12,758 |  -8.9% |
| Cold `/missing-page` JS response bodies, B | 133,767 | 120,968 |         -12,799 |  -9.6% |

Artifact compression is deterministic. Browser body totals are also identical across
all five runs per route (zero count/byte variation). Preview compresses the larger
chunks with gzip; the 427 B 404 chunk remains uncompressed. JavaScript request counts
remain one on Home and two on each other route. CSS remains 26,852 B raw / 5,697 B gzip.
The gallery route chunk itself increases by 41 B gzip (9,219 → 9,260 B, +0.4%);
its render savings outweigh that small cost.

Five-run cold-load medians and observed min–max ranges, in milliseconds:

| Metric                            |   Before median [min–max] |    After median [min–max] | Absolute change | Change |
| --------------------------------- | ------------------------: | ------------------------: | --------------: | -----: |
| `/` content readiness             | 1,153.2 [1,151.4–1,167.6] | 1,080.9 [1,078.7–1,098.1] |           -72.3 |  -6.3% |
| `/` local LCP                     | 2,044.0 [2,036.0–2,060.0] | 1,964.0 [1,848.0–1,988.0] |           -80.0 |  -3.9% |
| `/lastoria` content readiness     | 1,440.7 [1,438.0–1,456.7] | 1,373.6 [1,367.9–1,383.7] |           -67.1 |  -4.7% |
| `/lastoria` local LCP             | 1,520.0 [1,520.0–1,560.0] | 1,452.0 [1,448.0–1,480.0] |           -68.0 |  -4.5% |
| `/ilgiorno` content readiness     | 1,440.9 [1,437.6–1,449.4] | 1,369.2 [1,366.1–1,370.6] |           -71.7 |  -5.0% |
| `/ilgiorno` local LCP             | 2,672.0 [2,652.0–2,696.0] | 2,608.0 [2,596.0–2,616.0] |           -64.0 |  -2.4% |
| `/missing-page` content readiness | 1,421.2 [1,415.7–1,424.3] | 1,350.0 [1,348.9–1,354.7] |           -71.2 |  -5.0% |
| `/missing-page` local LCP         | 1,480.0 [1,476.0–1,492.0] | 1,412.0 [1,408.0–1,416.0] |           -68.0 |  -4.6% |

Content readiness is the MutationObserver timestamp when `main h1` first exists;
it is a startup-work indicator, not proof that all page images are loaded. These
local timing ranges do not overlap between versions, but five sequential samples
are limited lab evidence, not a population estimate or real-user Core Web Vitals.
The deterministic byte/work reductions are the strongest results. No claim is
made about execution milliseconds saved by gallery memoization or about build speed.

Gallery work for the complete down-and-back interaction (five runs per version;
identical counts in all five runs):

| Gallery work, count             | Before | After | Absolute change |  Change |
| ------------------------------- | -----: | ----: | --------------: | ------: |
| Figure renders                  |  1,519 |    96 |          -1,423 |  -93.7% |
| Loading observer entries        |    233 |    95 |            -138 |  -59.2% |
| Placeholder SVG encodes         |    690 |    47 |            -643 |  -93.2% |
| Loading targets observed at end |     49 |     0 |             -49 | -100.0% |

Every count is identical in all five runs of its version. All 49 final image
sources, alternative text and successful-load states match the baseline. The old
observer already disconnected on unmount; this is reduced ongoing work, not a
claim that an existing memory leak was repaired.

## Reproduction and artifacts

Environment: macOS 27.0.1, ARM64; Node 24.21.0; Vite+ CLI 1.0.0 / local package
0.3.0; Vite 8.2.2 / Rolldown 1.2.5. Browser: **Brave 154.1.96.61**, Chromium engine
154.0.8037.98, headless, clean temporary contexts without extensions. All reported
browser data and comparisons use Brave. A preliminary Chrome-for-Testing capture
was discarded when the user specified Brave or Chromium.

The durable harness and isolated, pinned tooling package are tracked in
[scripts/performance-audit](../scripts/performance-audit/). They do not add dependencies
to the application. Raw JSON, logs, screenshots and both production builds remain
outside tracked source under `/tmp/bragazzis-audit/` (also `/private/tmp/bragazzis-audit/`
on macOS). `before/` and `after/` contain the reported versions;
`lazy-home-experiment/` contains the rejected experiment.

From the repository root, install the isolated tools with their own lockfile:

```sh
(cd scripts/performance-audit && vp install --frozen-lockfile -- --ignore-workspace)
```

The tools package pins Playwright 1.63.0, pngjs 7.0.0 and pixelmatch 7.2.0.
The original temporary tools also included chrome-devtools-mcp 1.10.1; that CLI
is not required by the saved harness. The scripts default to the existing Brave
executable at `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`.
`AUDIT_BROWSER_PATH` may point to an installed Brave or Chromium executable;
`AUDIT_ARTIFACT_ROOT` and `AUDIT_SITE_URL` override the artifact directory and preview
URL. Use the same settings for both versions. No Google Chrome installation is needed.

For each revision, run `vp install`, `vp check`, `vp test`, and `vp run build`.
Use separate baseline and candidate checkouts so the tracked harness is available
while measuring baseline `0224f67`; invoke its scripts from the candidate checkout.
For the baseline build, copy its `dist` to the artifact directory:

```sh
mkdir -p /tmp/bragazzis-audit/before
cp -R dist /tmp/bragazzis-audit/before/dist
vp run preview --host 127.0.0.1 --port 4173
```

Keep that preview and production output fixed while measuring. From the candidate
checkout in a second terminal, run the following commands sequentially:

```sh
node scripts/performance-audit/sizes.mjs before
node scripts/performance-audit/audit.mjs before metrics
node scripts/performance-audit/audit.mjs before gallery
node scripts/performance-audit/audit.mjs before visual
node scripts/performance-audit/interactions.mjs before
node scripts/performance-audit/animation.mjs before
```

Stop the baseline preview before serving the candidate build on the same port.
Copy the candidate `dist` to `/tmp/bragazzis-audit/after/dist`, then repeat all commands
with `after` and run `node scripts/performance-audit/compare.mjs`.
Optional hidden-ticket investigation: run
`node scripts/performance-audit/story-top.mjs before` and `after` against the matching
previews. Use a fresh artifact directory for a new comparison to avoid stale outputs.

Cold-load measurements: five fresh contexts per version per route, 1,440 × 900,
DPR 1, cache disabled through CDP, network latency 150 ms, download 200,000 B/s,
upload 93,750 B/s, CPU slowdown 4×, no reduced-motion preference. After network
idle, wait four seconds before recording. Timing runs do not overlap other browser
work or builds. JavaScript bodies include **all `.js` resources**, including
`modulepreload` requests whose initiator is `link`, and exclude response headers.
Gzip artifact sizes use Node `gzipSync`; route totals come from Resource Timing
`encodedBodySize` under the local preview's gzip responses.

Gallery counts: five fresh production contexts per version, 1,440 × 900, DPR 1,
cache disabled, unthrottled. Scroll down and back in 700 px increments, waiting
140 ms at each increment. Instrument the React DevTools commit hook before startup
and count performed-work fibers for the figure function; wrap the native loading
observer to count deliveries and active targets, and count placeholder SVG encodes.
These are work counts, not claimed execution-time or retained-heap improvements.

## Correctness and design preservation

- `vp check`: formatting, lint and type checking pass. `vp test`: 4 files / 10 tests
  pass (8 existing plus 2 targeted gallery regressions).
  [tests/pages/ilGiornoGallery.test.tsx](../tests/pages/ilGiornoGallery.test.tsx) covers
  initial priority, load-ahead to the furthest intersecting item, non-intersecting
  entries, reverse-scroll eligibility, unchanged-figure render counts, eager loading,
  observer cleanup, and the no-IntersectionObserver fallback. The existing navigation
  mock now exposes `m` to match the production component API.
- `vp run build`: passes, including explicit `tsc`; the final rebuild produces the
  same asset hashes as the measured final version. Git diff whitespace checks pass.
  CI was not run remotely; its new command was verified locally.
- **41 paired production screenshots** at 390 × 900, 900 × 900 and 1,440 × 900,
  DPR 1, fresh contexts, cache disabled, normal motion and no network/CPU throttling.
  Home top/intro/editorial/seasonal/footer, Story top/chapters/photo/footer, gallery
  top/two scrolled states, 404, and mobile menu open/closed are included. Identical
  routes and scroll steps use the same script, font readiness and settle waits;
  animations remain enabled. No visible differences: pixelmatch finds zero changed
  pixels at threshold 0.1 with antialiasing included. **38 pairs are exactly identical**;
  the other three differ by at most 1 out of 255 in a colour channel. Visible ticket
  geometry varies by less than 0.003 px due to animation rounding.
- A 2.632 px initial coordinate difference on a still-hidden tablet ticket was
  investigated separately. Its opacity was zero. Five fresh repetitions per build
  produced exactly identical coordinates, transforms and hidden states; the scrolled
  visible states also match. Artifacts are in the temporary directory; `story-top.mjs` is preserved in
  the tracked harness. This transient was not treated as an introduced layout change.
- Captured native Home/menu animation keyframes, easing, durations and delays match
  exactly at all three widths, including the 2,400 ms hero photo entrance, 900 ms
  menu opening, child stagger and 500 ms exit. Animation constants and JS-driven
  title/parallax logic are unchanged; screenshots and scrolling exercise their output.
- Browser interaction records match exactly at all three widths with normal and
  reduced motion: skip-link focus, wheel scrolling, menu selection and Escape,
  Tab/Shift+Tab trapping, background inertness, resize closing, route focus,
  Visit anchor, footer return-to-top, and the 760/761 px mobile breakpoint transition.
  Back returns to Story at 650 px and Forward to Gallery at 1,800 px in every case;
  browser-native scroll restoration remains `auto`. No page errors were captured.
- All **702 non-JavaScript build assets** (including CSS, fonts and responsive
  images) are byte-identical between baseline and final builds. Original JPEGs,
  image presets, text, metadata, routes and SCSS have no changes.

Limitations: lab measurements use one Brave engine on macOS, not real-user traffic
or Safari/Firefox. Five samples establish a small controlled comparison, not a broad
performance guarantee. No retained-heap or gallery CPU-duration benefit is claimed.

## Rejected and deferred candidates

- **Home route splitting was implemented, measured and removed.** With five cold
  Brave runs under the same throttling, median Home content readiness rose from
  1,153.2 ms (range 1,151.4–1,167.6) to 1,350.1 ms (1,343.6–1,360.1), +196.9 ms
  / +17.1%. Local Home LCP rose from 2,044 to 2,164 ms. Total Home JS fell from
  133,340 to 122,971 B gzip, but JS requests rose from one to six. This was a real
  loading regression, so the final implementation preserves Home's existing eager
  import and the other routes' existing lazy imports. It does not add a preloading
  framework to compensate for the experiment.
- **Disabled parallax subscriptions:** `useScrollParallax` still subscribes on mobile
  and under reduced motion before returning zero. Replacing `useScroll` with a custom
  subscription risks losing Motion's native timeline acceleration and changing
  scroll animation behavior. Deferred to protect the strict animation constraint.
- **Media-query sharing:** multiple hook consumers create their own media-query
  subscriptions. No measured bottleneck justifies introducing a global subscription
  registry in this pass.
- **Route CSS splitting and image-preset changes:** the shared CSS is only 5,697 B
  gzip, and image-quality/responsive behavior is a strict constraint. No demonstrated
  benefit warranted added loading boundaries or changes to the asset pipeline.
- Existing lab font/layout shifts were observed but not redesigned: changing font
  loading or entrance behavior would require separate design review. No real-user
  Core Web Vitals or cross-browser conclusions are inferred from these local runs.

## Independent review follow-up

A GPT-6.1 Sol review at xhigh found no substantive runtime, accessibility, animation
or scrolling defects and independently confirmed the recorded measurements. It found
that the original reproduction instructions depended on temporary-only scripts.
The harness and its separate pinned tooling lockfile are now preserved in the repository,
and setup instructions work without the original temporary directory. Application
runtime code and the measurements above are unchanged by this follow-up.

Follow-up validation passed `vp check`, all 10 tests, `vp run build`, and the isolated
frozen-lockfile tool installation. The tracked size and comparison scripts reproduce
the saved totals and all 41 screenshot comparisons. A fresh Brave run of the tracked
animation harness completed at all three widths without page errors, writing to a
new artifact directory. The rebuilt production output is byte-identical to the
measured final build. The reviewer also checked and accepted the reproducibility fix.
