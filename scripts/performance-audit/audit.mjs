import { mkdir, writeFile } from "node:fs/promises";

import { chromium } from "playwright";

import { artifactRoot, browserPath, siteUrl } from "./config.mjs";
const [version = "before", mode = "metrics"] = process.argv.slice(2);
const out = `${artifactRoot}/${version}`;
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const base = siteUrl;
const instrument = () => {
    window.audit = {
        galleryRenders: 0,
        galleryCommits: 0,
        observerEntries: 0,
        intersectingEntries: 0,
        placeholders: 0,
        targets: new Set(),
        longTasks: [],
    };
    const nativeEncode = window.encodeURIComponent;
    window.encodeURIComponent = (v) => {
        if (String(v).startsWith("<svg")) window.audit.placeholders++;
        return nativeEncode(v);
    };
    const NativeObserver = window.IntersectionObserver;
    window.IntersectionObserver = class extends NativeObserver {
        constructor(cb, opts) {
            super((entries, observer) => {
                if (opts?.rootMargin === "1200px 0px") {
                    window.audit.observerEntries += entries.length;
                    window.audit.intersectingEntries += entries.filter(
                        (e) => e.isIntersecting,
                    ).length;
                }
                cb(entries, observer);
            }, opts);
            this.gallery = opts?.rootMargin === "1200px 0px";
        }
        observe(el) {
            if (this.gallery) window.audit.targets.add(el);
            return super.observe(el);
        }
        unobserve(el) {
            if (this.gallery) window.audit.targets.delete(el);
            return super.unobserve(el);
        }
        disconnect() {
            if (this.gallery) window.audit.targets.clear();
            return super.disconnect();
        }
    };
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true,
        inject: () => 1,
        onCommitFiberRoot(_id, root) {
            let renders = 0;
            function visit(f) {
                if (!f) return;
                if (
                    typeof f.type === "function" &&
                    f.type.toString().includes("ilgiorno__figure reveal") &&
                    f.flags & 1
                )
                    renders++;
                visit(f.child);
                visit(f.sibling);
            }
            visit(root.current);
            if (renders) {
                window.audit.galleryRenders += renders;
                window.audit.galleryCommits++;
            }
        },
        onCommitFiberUnmount() {},
    };
    new PerformanceObserver((list) =>
        window.audit.longTasks.push(...list.getEntries().map((e) => e.duration)),
    ).observe({ type: "longtask", buffered: true });
};
const results = {
    browser: browser.version(),
    version,
    mode,
    runs: [],
    screenshots: [],
    checks: [],
    errors: [],
};
async function newPage(
    width,
    reducedMotion = "no-preference",
    instrumented = false,
    throttle = false,
) {
    const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        reducedMotion,
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => results.errors.push(e.message));
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    if (throttle) {
        await cdp.send("Network.emulateNetworkConditions", {
            offline: false,
            latency: 150,
            downloadThroughput: 200000,
            uploadThroughput: 93750,
            connectionType: "cellular3g",
        });
        await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    }
    await page.addInitScript(() => {
        window.auditPerf = { mainReady: null, lcp: null, cls: 0 };
        const obs = new MutationObserver(() => {
            if (document.querySelector("main h1")) {
                window.auditPerf.mainReady = performance.now();
                obs.disconnect();
            }
        });
        obs.observe(document, { childList: true, subtree: true });
        new PerformanceObserver((list) => {
            for (const e of list.getEntries()) window.auditPerf.lcp = e.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
            for (const e of list.getEntries())
                if (!e.hadRecentInput) window.auditPerf.cls += e.value;
        }).observe({ type: "layout-shift", buffered: true });
    });
    if (instrumented) await page.addInitScript(instrument);
    return { context, page, cdp };
}
async function settle(page) {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(3200);
}
async function scrollTo(page, top) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
    await page.waitForTimeout(140);
}
async function capture(page, label, width) {
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `${out}/${width}-${label}.png`, animations: "allow" });
    const state = await page.evaluate(() => ({
        scrollY,
        height: document.body.scrollHeight,
        text: document.querySelector("main").innerText,
        images: [...document.images].map((el) => ({
            alt: el.alt,
            src: el.currentSrc.split("/").pop(),
            loaded: el.complete && el.naturalWidth > 0,
        })),
        elements: [
            ...document.querySelectorAll(
                "main h1, main h2, main figure, main picture, footer, .home-hero__photo, .home-editorial__counter",
            ),
        ].map((el) => {
            const r = el.getBoundingClientRect(),
                s = getComputedStyle(el);
            return {
                tag: el.tagName,
                class: el.className,
                x: r.x,
                y: r.y,
                w: r.width,
                h: r.height,
                font: s.font,
                color: s.color,
                background: s.backgroundColor,
                transform: s.transform,
                opacity: s.opacity,
            };
        }),
    }));
    results.screenshots.push({ label, width, ...state });
}
if (mode === "metrics") {
    for (const route of ["/", "/lastoria", "/ilgiorno", "/missing-page"]) {
        for (let run = 1; run <= 5; run++) {
            const { context, page } = await newPage(1440, "no-preference", false, true);
            await page.goto(base + route, { waitUntil: "networkidle" });
            await page.waitForTimeout(4000);
            const data = await page.evaluate(() => ({
                perf: window.auditPerf,
                scripts: performance
                    .getEntriesByType("resource")
                    .filter((e) => /\.js(?:[?#]|$)/.test(e.name))
                    .map((e) => ({
                        name: e.name.split("/").pop(),
                        encoded: e.encodedBodySize,
                        transfer: e.transferSize,
                    })),
                resources: performance
                    .getEntriesByType("resource")
                    .filter((e) => !e.name.startsWith("data:"))
                    .map((e) => ({
                        name: e.name.split("/").pop(),
                        encoded: e.encodedBodySize,
                        transfer: e.transferSize,
                    })),
                nav: performance
                    .getEntriesByType("navigation")
                    .map((e) => ({ dcl: e.domContentLoadedEventEnd, load: e.loadEventEnd })),
                paint: performance
                    .getEntriesByType("paint")
                    .map((e) => ({ name: e.name, time: e.startTime })),
            }));
            results.runs.push({ route, run, ...data });
            console.log(
                `${version} load ${route} ${run}: ${data.scripts.reduce((s, e) => s + e.encoded, 0)} script bytes`,
            );
            await context.close();
        }
    }
} else if (mode === "gallery") {
    for (let run = 1; run <= 5; run++) {
        const { context, page } = await newPage(1440, "no-preference", true);
        await page.goto(base + "/ilgiorno");
        await settle(page);
        const initial = await page.evaluate(() => ({
            ...window.audit,
            targets: window.audit.targets.size,
        }));
        const max = await page.evaluate(() => document.body.scrollHeight - innerHeight);
        for (let y = 0; y <= max; y += 700) await scrollTo(page, y);
        await scrollTo(page, max);
        await page.waitForTimeout(1800);
        const down = await page.evaluate(() => ({
            ...window.audit,
            targets: window.audit.targets.size,
            images: [...document.images].map((i) => ({
                src: i.currentSrc.split("/").pop(),
                alt: i.alt,
                loaded: i.complete && i.naturalWidth > 0,
            })),
        }));
        for (let y = max; y >= 0; y -= 700) await scrollTo(page, y);
        await scrollTo(page, 0);
        await page.waitForTimeout(400);
        const up = await page.evaluate(() => ({
            ...window.audit,
            targets: window.audit.targets.size,
        }));
        results.runs.push({ run, initial, down, up });
        console.log(
            `${version} gallery ${run}: renders ${up.galleryRenders}, entries ${up.observerEntries}, targets ${up.targets}, placeholders ${up.placeholders}`,
        );
        await context.close();
    }
} else if (mode === "visual") {
    for (const width of [390, 900, 1440]) {
        const { context, page } = await newPage(width);
        for (const [route, name, targets] of [
            [
                "/",
                "home",
                [".home-intro", ".home-editorial__item:nth-child(2)", ".home-seasonal", "footer"],
            ],
            ["/lastoria", "story", [".lastoria__chapter", ".lastoria__figure", "footer"]],
            [
                "/ilgiorno",
                "gallery",
                [".ilgiorno__figure:nth-of-type(4)", ".ilgiorno__figure:nth-of-type(12)"],
            ],
            ["/missing-page", "missing", []],
        ]) {
            await page.goto(base + route);
            await settle(page);
            await capture(page, `${name}-top`, width);
            for (let i = 0; i < targets.length; i++) {
                const top = await page
                    .locator(targets[i])
                    .first()
                    .evaluate((el) => el.getBoundingClientRect().top + scrollY - 100);
                const start = await page.evaluate(() => scrollY);
                for (let y = start; y < top; y += 600) await scrollTo(page, y);
                await scrollTo(page, top);
                await capture(page, `${name}-${i + 1}`, width);
            }
            console.log(`${version} visual ${width} ${name}`);
        }
        if (width === 390) {
            await page.goto(base);
            await settle(page);
            await page.getByRole("button", { name: "Open menu" }).click();
            await page.waitForTimeout(1600);
            await capture(page, "menu-open", width);
            results.checks.push({
                check: "menu focus",
                value: await page.evaluate(() => document.activeElement.textContent),
            });
            await page.keyboard.press("Shift+Tab");
            results.checks.push({
                check: "reverse tab trap",
                value: await page.evaluate(() => document.activeElement.getAttribute("aria-label")),
            });
            await page.keyboard.press("Tab");
            results.checks.push({
                check: "forward tab trap",
                value: await page.evaluate(() => document.activeElement.textContent),
            });
            await page.keyboard.press("Escape");
            await page.waitForTimeout(1600);
            results.checks.push({
                check: "escape closes/restores focus",
                value: await page.evaluate(() => ({
                    menu: !!document.querySelector("[role=dialog]"),
                    focus: document.activeElement.getAttribute("aria-label"),
                    overflow: document.body.style.overflow,
                    inert: document.querySelector(".layout__background").inert,
                })),
            });
            await capture(page, "menu-closed", width);
            await page.getByRole("button", { name: "Open menu" }).click();
            await page.waitForTimeout(1600);
            await page.setViewportSize({ width: 900, height: 900 });
            await page.waitForTimeout(1600);
            results.checks.push({
                check: "resize closes mobile menu",
                value: await page.evaluate(() => ({
                    menu: !!document.querySelector("[role=dialog]"),
                    inert: document.querySelector(".layout__background").inert,
                })),
            });
        }
        await context.close();
    }
}
await writeFile(`${out}/${mode}.json`, JSON.stringify(results, null, 2));
await browser.close();
