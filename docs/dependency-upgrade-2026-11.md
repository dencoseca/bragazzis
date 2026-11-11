# Dependency upgrade review — 11 November 2026

Updated both package manifests to npm's `latest` dist-tags, preserving exact pins.
Vite+ and its core alias stay on the migrator-selected bundle, rather than upgrading
bundled tools independently. Node remains on the repository's supported 24.x line.

## Release notes and compatibility

| Package                     | Previous → current | Review and project impact                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vite+ / core                | 1.1.0 → 1.6.0      | [Releases](https://github.com/voidzero-dev/vite-plus/releases): reviewed 1.2–1.6, including 1.5.1. New lint/format behavior requires checks; Vitest disk caches now default on and browser mode has a new port (unused here). No tsx, ts-node, pack, custom environment, or Effect migration applies.                                                                                                               |
| lenis                       | 1.3.26 → 1.3.27    | [Notes](https://github.com/darkroomengineering/lenis/releases/tag/v1.3.27): fixes class cleanup after destroy; adds SVG scroll targets. No breaking API change.                                                                                                                                                                                                                                                     |
| motion                      | 14.1.0 → 14.12.0   | [Changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md): accelerated independent transforms, spring/scroll/layout and AnimatePresence fixes, additive gesture APIs. No declared breaking API change; navigation and animation need browser checks.                                                                                                                                             |
| react / react-dom           | 19.3.0 → 19.3.1    | [Notes](https://github.com/facebook/react/releases/tag/v19.3.1): RSC transport protocol improvement. This app renders on the client.                                                                                                                                                                                                                                                                                |
| react-router-dom            | 7.18.4 → 7.18.5    | [v7 notes](https://github.com/remix-run/react-router/blob/v7/CHANGELOG.md#v7185): bounded server manifest processing and hardened turbo-stream decoding. No client API migration. The separate react-router v8 release does not change react-router-dom's latest tag.                                                                                                                                               |
| @testing-library/user-event | 14.6.7 → 14.6.9    | [Releases](https://github.com/testing-library/user-event/releases): null input and numeric string handling fixes. No API migration.                                                                                                                                                                                                                                                                                 |
| @types/node                 | 26.6.5 → 26.6.6    | [Upstream history](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/master/types/node): declaration updates; no standalone release notes. Retained the existing major; explicit TypeScript and lint checks cover project usage.                                                                                                                                                                           |
| @vitejs/plugin-react        | 6.1.2 → 6.3.0      | [Changelog](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/CHANGELOG.md): refresh filters, broader peers and parallel compiler-preset support. Default react() configuration needs no changes.                                                                                                                                                                                         |
| happy-dom                   | 20.14.6 → 21.0.4   | [Releases](https://github.com/capricorn86/happy-dom/releases): **breaking** default disables external CSS and iframe loading; disableCSSFileLoading deprecated in favor of enableCSSFileLoading. Tests do not depend on external loads, so retain the safer defaults. Patches address redirect authorization, ESM injection and origin isolation.                                                                   |
| sass                        | 1.105.1 → 1.108.2  | [Changelog](https://github.com/sass/dart-sass/blob/main/CHANGELOG.md): **potentially breaking** escape normalization, ambiguous exponent units and duplicate rest parameters; 1.108 restores unintended escaped-identifier regressions. 1.108.2 has no user-visible changes. Existing styles require no rewrite; verified by compilation.                                                                           |
| playwright (audit package)  | 1.64.0 → 1.65.0    | [Notes](https://github.com/microsoft/playwright/blob/main/docs/src/release-notes-js.md#version-165): **breaking** inert actionability, accessible-name, cookie/proxy/API-request behavior, TS class-field semantics, stylesheet imports and runner/report changes. Audit uses plain .mjs scripts and no cookies/proxy/request bodies or test runner. Interaction checks exercise selectors and menu inert handling. |
| pnpm (both packages)        | 12.11.2 → 12.18.0  | [Releases](https://github.com/pnpm/pnpm/releases): reviewed intervening releases. Changes include dependency resolution/peer deduplication, lockfile validation, env-file literal handling, registry and skill-link behavior. No custom hooks, env-file flags, publishing or skills configuration applies. Both frozen installs pass.                                                                               |
| setup-vp                    | 1.21.2 → 1.22.0    | [Notes](https://github.com/voidzero-dev/setup-vp/releases/tag/v1.22.0): additive opt-in toolchain caching and version outputs; selects project Node before install. Existing inputs remain supported; new cache option left disabled.                                                                                                                                                                               |

Already latest: react-error-boundary, @testing-library/react, @types/react,
@types/react-dom, TypeScript, pixelmatch, pngjs, actions/checkout
and actions/cache.

vite-imagetools 12.0.1 → 12.0.2: [changelog](https://github.com/JonasKruckenberg/imagetools/blob/main/packages/vite/CHANGELOG.md) fixes dev-cache hits to serve cached bytes verbatim instead of re-encoding lossy images. No API change. Production image generation is covered by the build.

## Migration

Installed the original lockfile before running `vp migrate --no-interactive`.
The installed global migrator selected 1.5.1; ran the latest target with
`vp dlx --package=vite-plus@1.6.0 vp migrate --no-interactive` to reach 1.6.0.
The migrator removed the stale Vitest 5.0.3 override and added exact release-age
exceptions for its own 1.6.0 packages. Kept those generated settings; no global
release-age policy was disabled. Direct registry checks found Sass 1.108.2 and
vite-imagetools 12.0.2 hidden by the release-age filter in `vp outdated`; explicit
version installs added exceptions for those two exact versions too. Bundled tools are Vite 8.3.7, Rolldown 1.2.18,
Vitest 5.1.0, Oxlint 1.93.0, Oxfmt 0.78.0, oxlint-tsgolint 7.0.2006 and tsdown 0.23.4.

## Validation

- Both packages: `vp install --frozen-lockfile`; `vp outdated` reports no updates.
- `vp check`: formatting, lint and type checks pass.
- `vp test`: 5 files, 15 tests pass.
- `vp run build`: explicit TypeScript check and production image/CSS/JS build pass.
- Chromium 157.0.8103.39: six interaction runs pass at 390, 900 and 1440 px,
  with normal and reduced motion. No page errors. Checked route focus, menus,
  skip link, scrolling, visit anchor, back-to-top and breakpoints; recorded
  Back/Forward restoration is exactly 650/1800 px in every run.
- Visual audit captured Home, La Storia, Il Giorno and 404 at all three widths;
  inspected Home at each width and the mobile menu. This is a smoke check,
  not a before/after pixel comparison.
