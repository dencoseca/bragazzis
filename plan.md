# Codebase Improvement Plan

Issues are grouped by priority. Each item includes the affected file(s) and step-by-step instructions to resolve it.

---

## High Priority

### 1. `useSmoothScroll` — `requestAnimationFrame` loop is never cancelled

**Files:** `src/hooks/useSmoothScroll.ts`

The `requestAnimationFrame` loop keeps firing after the component unmounts because `cancelAnimationFrame` is never called. This causes a CPU/memory leak on every route change.

**Fix:**

- Store the request ID returned by `requestAnimationFrame` in a variable.
- In the cleanup function, call `cancelAnimationFrame(id)` before destroying the Lenis instance.

```ts
useEffect(() => {
    lenisRef.current = new Lenis();
    let rafId: number;

    function raf(time: number) {
        lenisRef.current?.raf(time);
        rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
        cancelAnimationFrame(rafId);
        lenisRef.current?.destroy();
        lenisRef.current = null;
    };
}, []);
```

---

### 2. `Home.tsx` — resize listener never attaches on mobile

**Files:** `src/pages/Home.tsx`

The resize effect runs once with `[]` deps. If `window.innerWidth < breakpoints.mobile` on mount, it early-returns and never registers a listener — even if the user later rotates to landscape.

**Fix:**

Move the mobile guard inside the handler instead of before the listener registration, or re-run the effect when `dimensions.width` crosses the breakpoint. The simplest approach:

```ts
useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
        if (window.innerWidth < breakpoints.mobile) return;
        setDimensions({
            height: window.innerHeight,
            width: window.innerWidth,
            vh: window.innerHeight / 100,
            vw: window.innerWidth / 100,
        });
    }, 1000);

    window.addEventListener("resize", debouncedHandleResize);
    return () => window.removeEventListener("resize", debouncedHandleResize);
}, []);
```

---

### 3. `Menu` links don't close the menu on navigation

**Files:** `src/components/Menu.tsx`, `src/components/Layout.tsx`

Clicking a `<Link>` navigates but the menu stays open because nothing calls `setMenuIsOpen(false)`.

**Fix:**

Option A — Pass `setMenuIsOpen` (or a `closeMenu` callback) into `Menu` and call it `onClick` on each `<Link>`.

Option B — In `Layout.tsx`, add an effect that watches `location` and closes the menu on route change:

```ts
useEffect(() => {
    setMenuIsOpen(false);
}, [location.pathname]);
```

---

## Medium Priority

### 4. `Header.tsx` — `toggleMenu` uses two `if` checks instead of `if/else`

**Files:** `src/components/Header.tsx`

Both branches can theoretically execute. Replace with a single `if/else`:

```ts
const toggleMenu = useCallback(() => {
    if (menuIsOpen) {
        setMenuIsOpen(false);
        controls.start("closed");
    } else {
        setMenuIsOpen(true);
        controls.start("open");
    }
}, [menuIsOpen, setMenuIsOpen, controls]);
```

---

### 5. `IlGiorno.tsx` — ~50 images eagerly imported at module level

**Files:** `src/pages/IlGiorno.tsx`

Every image is a static import, so Vite must resolve and include all of them when this route chunk loads, even if most are off-screen.

**Fix:**

- All images already use `loading="lazy"` on the `<img>` tag, which is good, but the JS module still references all of them upfront.
- Consider an intersection-observer approach where images only get their `src` set when they enter (or approach) the viewport, or use a virtualised list to reduce initial DOM size.
- At minimum, move the image array to a separate data file so the component itself stays lean.

---

### 6. `imageMap.ts` — eager glob of all images at startup

**Files:** `src/utils/imageMap.ts`

`import.meta.glob` with `eager: true` forces every matched file into the main bundle. This module is imported by `OptimizedImage`, which is used on every page.

**Fix:**

- Switch to lazy globs (`eager: false`) and resolve URLs on demand, or
- Scope the glob to only the images actually used by the current route (harder with the current architecture), or
- Generate a static JSON mapping at build time (via the existing `scripts/optimize-images.mjs` or a Vite plugin) so runtime JS doesn't need to glob at all.

---

### 7. `AnimatePresence` misused in Cover, FloatingItems, FullWidthBanner, and LaStoria

**Files:** `src/components/Cover.tsx`, `src/components/FloatingItems.tsx`, `src/components/FullWidthBanner.tsx`, `src/pages/LaStoria.tsx`

`AnimatePresence` only does something when its direct children conditionally mount/unmount (with a `key`). In these files it wraps permanently-rendered content, so it adds overhead for no benefit.

**Fix:**

Remove the `<AnimatePresence>` wrapper from each of these four components. The `AnimatePresence` in `Layout.tsx` (wrapping `Menu`) is correct and should stay.

---

### 8. Three separate `useScroll()` hooks on the Home page

**Files:** `src/components/Cover.tsx`, `src/components/FloatingItems.tsx`, `src/components/FullWidthBanner.tsx`

Each component independently calls `useScroll()`, creating three separate scroll listeners.

**Fix:**

- Call `useScroll()` once in `Home.tsx` and pass `scrollYProgress` down as a prop, or
- Create a shared scroll context that provides `scrollYProgress` to all children.

---

### 9. `dimensions` / `breakpoints` prop-drilling

**Files:** `src/pages/Home.tsx`, `src/components/Cover.tsx`, `src/components/FloatingItems.tsx`, `src/components/FullWidthBanner.tsx`

**Fix:**

Extract the `dimensions` state and resize logic into a custom hook (e.g., `useViewportDimensions`) and either call it in each component directly or expose it via React context. This eliminates the prop-drilling chain.

---

### 10. Breakpoints duplicated between JS and CSS

**Files:** `src/pages/Home.tsx`, SCSS files (likely `src/styles/_variables.scss`)

JS breakpoints (`mobile: 760`, `tablet: 1080`) probably mirror SCSS variables. Any change requires updating both.

**Fix:**

- Define breakpoints as CSS custom properties on `:root` and read them from JS via `getComputedStyle`, or
- Use a shared config file that both Vite (JS) and SCSS (via `additionalData` in Vite config) can consume.

---

## Low Priority

### 11. `Home.tsx` — `window` access in `useState` initializer (SSR-unsafe)

**Files:** `src/pages/Home.tsx`

**Fix:**

Guard with a `typeof window !== "undefined"` check or initialise with default values and populate in a `useEffect`:

```ts
const [dimensions, setDimensions] = useState({
    height: 0, width: 0, vh: 0, vw: 0,
});

useEffect(() => {
    setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
        vh: window.innerHeight / 100,
        vw: window.innerWidth / 100,
    });
}, []);
```

---

### 12. Footer copyright year is hardcoded to 2021

**Files:** `src/components/Footer.tsx`

**Fix:**

Replace `2021` with `{new Date().getFullYear()}`, or if you want a range: `2021–{new Date().getFullYear()}`.

---

### 13. `--vh` custom property workaround is obsolete

**Files:** `src/pages/Home.tsx`, any SCSS using `var(--vh)`

**Fix:**

Modern browsers support `dvh` (dynamic viewport height). Replace `calc(var(--vh, 1vh) * 100)` in CSS with `100dvh` and remove the `useEffect` that sets `--vh`. Check browser support requirements first.

---

### 14. `preventContextMenu` handler duplicated in 4 files

**Files:** `src/components/Cover.tsx`, `src/components/FloatingItems.tsx`, `src/components/FullWidthBanner.tsx`, `src/pages/IlGiorno.tsx`

**Fix:**

Move to a shared utility file (e.g., `src/utils/eventHandlers.ts`) and import from there.

---

### 15. `NotFound` page doesn't use `Layout`

**Files:** `src/pages/NotFound.tsx`

This means no `<Helmet>` meta tags, no header/footer, and no consistent styling.

**Fix:**

Wrap the content in `<Layout pageTitle="404">` and adjust styling as needed. Alternatively, if the minimal design is intentional, at least add a `<Helmet>` for the page title and a `noindex` meta tag.

---

### 16. `og:image` points to an SVG favicon

**Files:** `index.html`, `src/components/Layout.tsx`

Most social platforms can't render SVG for link previews.

**Fix:**

Create a raster image (PNG or JPG, ideally 1200×630px) for use as the OG image and update both `index.html` and `Layout.tsx`.

---

### 17. Duplicate `<meta>` tags between `index.html` and `Layout.tsx`

**Files:** `index.html`, `src/components/Layout.tsx`

Both define `description`, `og:*`, and `twitter:*` tags. `react-helmet-async` overrides them at runtime but crawlers that don't execute JS see the static ones.

**Fix:**

Keep the tags in `index.html` as sensible defaults (for no-JS crawlers) and let Helmet override per-page. Just be aware they need to stay in sync — or remove the per-page ones from `index.html` if all crawlers execute JS.

---

### 18. `clsx` dependency is unused

**Files:** `package.json`

**Fix:**

Run `pnpm remove clsx`.

---

### 19. `svgr` plugin is configured but never used

**Files:** `package.json`, `vite.config.ts`

No SVG is imported as a React component anywhere.

**Fix:**

If you don't plan to use SVGR, run `pnpm remove vite-plugin-svgr` and remove the `svgr()` call from `vite.config.ts`.

---

### 20. Footer scroll-to-top button is not keyboard accessible

**Files:** `src/components/Footer.tsx`

The scroll-to-top arrow is a `<div onClick={scrollToTop}>` — it can't be focused or activated via keyboard.

**Fix:**

Replace the `<div>` with a `<button>` (with `type="button"`) and add an `aria-label="Scroll to top"`.
