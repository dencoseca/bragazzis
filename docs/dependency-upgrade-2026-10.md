# Dependency upgrade review — 11 October 2026

Versions were checked against npm's `latest` dist-tags. Direct dependencies use exact
versions; the two `catalog:` references resolve to exact Vite+ pins. Both the app and
independent performance-audit package pin pnpm 12.11.2 and have regenerated lockfiles.
Vite+ owns its bundled tool versions: standalone Vite 8.3.4 is newer than bundled
8.3.3, but replacing the bundle would bypass Vite+'s supported migration.

## Release review

| Dependency                      | Previous → pinned         | Release notes and impact                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vite+ / Vite+ core              | 0.3.0 → 1.1.0             | [Releases](https://github.com/voidzero-dev/vite-plus/releases), [upgrade procedure](https://viteplus.dev/guide/migrate#upgrade-from-vite-03-to-10). Reviewed intervening 0.3.x and 1.0 release candidates/stable. Vitest 5 changes apply; see below. No task-cache, pack, Corepack, custom lint-plugin or editor-wrapper configurations need rewriting here. Node 24.11+ already satisfies the new runtime requirement.                                                                                                            |
| Motion                          | 13.2.0 → 14.1.0           | [Changelog](https://github.com/motiondivision/motion/blob/main/CHANGELOG.md). Version 14 removes internal APIs restored in 13.5.1 and pins internal packages. The app imports supported `motion/react` APIs only. Intervening scroll-offset, spring, `m`, and AnimatePresence changes warrant browser navigation/scroll checks.                                                                                                                                                                                                    |
| React / React DOM               | 19.2.8 → 19.3.0           | [Changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md). New ViewTransition, Fragment refs and browser APIs are additive. Independent transitions, Trusted Types integration, lazy and effect fixes require checking existing lazy routes and navigation; no new API adoption is needed.                                                                                                                                                                                                                             |
| react-error-boundary            | 6.1.4 → 6.1.6             | [Releases](https://github.com/bvaughn/react-error-boundary/releases). Ref inference, optional/defaulted props and context memoization fixes; existing boundary and recovery tests remain valid.                                                                                                                                                                                                                                                                                                                                    |
| react-router-dom                | 7.18.3 → 7.18.4           | [Versioned changelog](https://github.com/remix-run/react-router/blob/react-router%407.18.4/packages/react-router/CHANGELOG.md). Fixes RSC redirect escaping and unintended hydration/revalidation view transitions. The app uses client-side routing. 7.18.4 is the latest `react-router-dom` release; standalone `react-router` has a separate newer major.                                                                                                                                                                       |
| @types/node                     | 26.4.1 → 26.6.5           | [Declaration history](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/master/types/node). No conventional release notes are published; compared the published declarations at both endpoints. Existing fs/path/url APIs are unchanged; zlib additions are optional. Keeps the existing Node 26 type line; the runtime contract remains Node 24.11–24.x.                                                                                                                                                                 |
| @types/react / @types/react-dom | 19.2.18 / 19.2.7 → 19.3.0 | [React declarations](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/master/types/react), [DOM declarations](https://github.com/DefinitelyTyped/DefinitelyTyped/commits/master/types/react-dom). Compared published declarations: new Fragment refs, ViewTransition, submitter and browser APIs align with React 19.3. Type checks pass.                                                                                                                                                                                |
| @vitejs/plugin-react            | 6.1.1 → 6.1.2             | [Changelog](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/CHANGELOG.md). Compound-component HMR fixes. The new optional compiler peer requirement and deprecated `compiler.logDiagnostics` do not affect plain `react()` here.                                                                                                                                                                                                                                                                       |
| happy-dom                       | 20.14.0 → 20.14.6         | [Releases](https://github.com/capricorn86/happy-dom/releases). Computed-style/cache, comment parsing and cookie scope security fixes. No API migration; all DOM suites pass.                                                                                                                                                                                                                                                                                                                                                       |
| Sass                            | 1.104.0 → 1.105.1         | [Changelog](https://github.com/sass/dart-sass/blob/main/CHANGELOG.md). First-class module APIs and comment/compiler fixes. Existing SCSS does not need migration and compiles successfully.                                                                                                                                                                                                                                                                                                                                        |
| Pixelmatch                      | 7.2.0 → 8.0.0             | [Release notes](https://github.com/mapbox/pixelmatch/releases/tag/v8.0.0). Changes YIQ to OKLab/HyAB; API and threshold scale stay the same, but counts can differ. Comparison rows now identify the metric and threshold. See the audit guidance below.                                                                                                                                                                                                                                                                           |
| Playwright                      | 1.63.0 → 1.64.0           | [Release notes](https://github.com/microsoft/playwright/blob/main/docs/src/release-notes-js.md#version-164). Device screen propagation, JSX compilation, missing-snapshot status and hidden-iframe visibility changes do not affect these `.mjs` scripts using explicit viewports and an external Chromium executable. Browser interactions still require validation.                                                                                                                                                              |
| pnpm                            | 11.5.0 → 12.11.2          | [Releases](https://github.com/pnpm/pnpm/releases), [12.0 migration changes](https://github.com/pnpm/pnpm/releases/tag/v12.0.0). Reviewed the changelog shipped in the 12.11.2 npm tarball across the version interval. Strict workspace-setting validation accepts this configuration. No Git dependencies, named registries, custom pnpmfile hooks or `--frozen-lockfile false` usage need migration. Regenerated lockfiles include pnpm's package-manager document and deterministic peer resolution. Both frozen installs pass. |

Already latest and retained exactly: lenis 1.3.26, @testing-library/react 16.3.3,
@testing-library/user-event 14.6.7, TypeScript 7.0.2, vite-imagetools 12.0.1 and pngjs 7.0.0.

## Vite+ migration implementation

Installed the original lockfile, then invoked the **target** migrator without first
updating the project's Vite+ dependencies:

```sh
npx --yes --package=vite-plus@1.1.0 vp migrate --no-interactive
```

The migrator aligned the Vite+/core catalog entries, upgraded setup-vp, ignored the
new `.vitest/` artifact directory, and added `test.clearMocks: false` for v4
compatibility. It reported no blocking or manual source-migration findings.

Followed the [Vite+ toolchain alignment guidance](https://viteplus.dev/guide/upgrade-project)
by explicitly pinning `vitest@*` to **5.0.3**, matching `vp toolchain vitest`, so
transitive consumers cannot install a second runner. The migrated toolchain is
Vite 8.3.3, Rolldown 1.2.12, Vitest 5.0.3, Oxlint 1.87.0, Oxfmt 0.72.0,
oxlint-tsgolint 7.0.2003 and tsdown 0.23.0. These remain Vite+-managed dependencies.

Reviewed the [upstream Vitest 5 migration guide](https://vitest.dev/guide/migration/)
and [Vite+ compatibility checklist](https://viteplus.dev/guide/vitest-v5).
Tests passed first with the generated compatibility setting, then all 11 passed
again after removing it without changing tests or assertions. The final config
uses the new clearMocks default. The repository has no browser-mode tests,
benchmarks, coverage thresholds, inline test projects, custom environments,
nested hoisted mocks or removed runner entrypoints requiring other migrations.

## CI actions

- `actions/checkout`: v4 → **v7.0.1** ([changelog](https://github.com/actions/checkout/blob/v7.0.1/CHANGELOG.md)). Node 24 runner requirements and credential storage changes are compatible with `ubuntu-latest`. The unsafe checkout restriction concerns `pull_request_target`/`workflow_run`; this workflow uses `pull_request`/`workflow_dispatch`.
- `actions/cache`: v4 → **v6.1.0** ([releases](https://github.com/actions/cache/releases)). Node 24/runner minimum and ESM changes are supported by hosted Ubuntu runners; cache inputs stay compatible.
- `voidzero-dev/setup-vp`: frozen v1 → **v1.21.2** ([releases](https://github.com/voidzero-dev/setup-vp/releases)). The migrator initially selected 1.21.1; moved to latest patch after review. The v1 tag is frozen at 1.15.0. New explicit registry-auth configuration does not apply to this public npm install.

## Performance-audit comparisons

Pixelmatch 8 uses OKLab/HyAB. Keep threshold 0.1 and `includeAA: true`; reports are
measurements, with no configured pixel-count pass/fail budget to retune. Each row
now records `metric` and `threshold`. Do not compare its perceptual counts directly
with historical Pixelmatch 7 reports (including the earlier performance audit).
Re-run **both original screenshot sets** through the current comparator for a
valid comparison. `rawPixels` still measures exact RGBA differences independently
of Pixelmatch. Identical and deliberately changed PNG fixtures verify zero and
one differing pixel respectively, including diff image/report output.

## Validation

- Root and performance-audit frozen installs with pnpm 12.11.2.
- `vp outdated` reports no direct package updates for either package (Vite is resolved through its managed alias).
- `vp check`: formatting, lint and type checks.
- `vp test`: all 4 files and 11 tests; no skips or assertion changes.
- `vp run build`: explicit TypeScript check and production build.
- Pixelmatch comparator exercised with identical and changed PNG fixtures.
- Chromium 154.0.8037.57: all six interaction runs passed at 390, 900 and 1440 px,
  with normal and reduced motion; no page errors. Checked navigation, skip-link
  focus, mobile menu, scrolling, visit anchor, back-to-top and responsive breakpoints.
  Recorded Back/Forward positions restore exactly to 650/1800 px in all six runs.
- Visual audit captured Home, La Storia, Il Giorno and 404 pages across all three
  widths, including scrolled sections and the mobile menu; inspected representative
  screenshots. This is a current-version smoke check, not a before/after pixel-diff claim.
