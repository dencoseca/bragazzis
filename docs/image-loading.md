# Image loading policy and measurement

Issue: [#109](https://github.com/dencoseca/bragazzis/issues/109).

`OptimizedImage` separates eligibility (`shouldLoad`, default `true`) from urgency
(`loading`, default `"lazy"`). Ineligible images have only an intrinsic-size local
SVG placeholder, with no real `src` or `<source>` elements. `priority` overrides
loading to eager and adds high fetch priority and synchronous decoding only when
eligible. Home releases its below-fold sources when the hero settles; they retain
native lazy loading. The gallery explicitly uses `loading="eager"` so its existing
two initial images and observer-driven three-image load-ahead remain eager.
La Storia's two animated ticket images also explicitly use `loading="eager"` so
their requests start without waiting for their entrance transforms to reach the viewport.

An image error removes remote sources and displays an intrinsic-size local SVG with a dark background and light text
reading “Image unavailable”. Nonempty alternative text includes the failure and
original description; decorative images retain empty alt text. The picture exposes
`data-image-error="true"`. The hero reveals that fallback and handles the error to
release its intro immediately. `onReady` remains a successful-load/decode callback;
React's picture `onError` reports failure. Successful reveal timing is unchanged.
There is no automatic retry; reloading the page retries failed images.

## Browser/network comparison

Measured on 7 September 2026 against production builds of `main` at `3e3268e`
and the issue implementation, using local macOS Chromium from Playwright 1.62.1.
Each build had one fresh browser context per viewport, device scale factor 1,
cache disabled, and CDP network emulation with 150 ms latency, 200,000 bytes/s
download, 93,750 bytes/s upload, and `connectionType: "cellular3g"`.

Times below are milliseconds from navigation start. The browser remained at the
top for ten seconds after DOMContentLoaded, then scrolled directly to the bottom
and observed requests for another five seconds. Viewports were 390×900 and
1280×900. Counts include the hero and five Home content images.

| Viewport | Build  | Hero request | Other requests before scroll                      | Requests after scroll           |
| -------- | ------ | ------------ | ------------------------------------------------- | ------------------------------- |
| Mobile   | Before | 1,096        | All five at 1,704                                 | None                            |
| Mobile   | After  | 1,042        | Shelves 1,633; coffee and ciabatta 1,634          | Shop and seasonal egg at 11,039 |
| Desktop  | Before | 1,061        | All five at 1,923                                 | None                            |
| Desktop  | After  | 1,034        | Shelves and coffee 1,905; ciabatta and shop 1,906 | Seasonal egg at 11,032          |

Before scrolling, request counts fell from six to four on mobile and six to five
on desktop. Chromium's native lazy-load distance still requests nearby images
before they enter the viewport. This single paired run demonstrates request
deferral, not an LCP, bandwidth, or general page-speed improvement. Small absolute
timing differences between runs should not be interpreted as performance gains.

To reproduce, run `vp run build` and `vp preview --host 127.0.0.1 --port 4173`,
then run the following with `node --input-type=module` from the repository root
for each revision. Stop the preview before changing builds.

```js
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", {
        offline: false,
        latency: 150,
        downloadThroughput: 200000,
        uploadThroughput: 93750,
        connectionType: "cellular3g",
    });
    const requests = [];
    const start = Date.now();
    page.on("request", (request) => {
        if (request.resourceType() === "image" && !request.url().startsWith("data:")) {
            requests.push({ image: request.url().split("/").pop(), ms: Date.now() - start });
        }
    });
    await page.goto("http://127.0.0.1:4173/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(10000);
    const beforeScroll = [...requests];
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(5000);
    console.log({ width, beforeScroll, afterScroll: requests.slice(beforeScroll.length) });
    await context.close();
}
await browser.close();
```
