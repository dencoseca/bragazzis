import { mkdir, writeFile } from "node:fs/promises";

import { chromium } from "playwright";

import { artifactRoot, browserPath, siteUrl } from "./config.mjs";
const version = process.argv[2] ?? "before";
await mkdir(`${artifactRoot}/${version}`, { recursive: true });
const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const output = { browser: browser.version(), version, runs: [], errors: [] };
for (const width of [390, 900, 1440]) {
    const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => output.errors.push(e.message));
    await page.addInitScript(() => {
        window.animationAudit = [];
        const native = Element.prototype.animate;
        Element.prototype.animate = function (keyframes, options) {
            window.animationAudit.push({ class: this.className, keyframes, options });
            return native.call(this, keyframes, options);
        };
    });
    await page.goto(`${siteUrl}/`);
    await page.waitForTimeout(4300);
    let menu = null;
    if (width === 390) {
        menu = await page.evaluate(async () => {
            const result = { opening: [], closing: [] };
            document.querySelector(".header__menu-button").click();
            let start = performance.now();
            while (performance.now() - start < 1300) {
                await new Promise(requestAnimationFrame);
                const el = document.querySelector(".menu");
                if (el)
                    result.opening.push({
                        t: performance.now() - start,
                        clipPath: getComputedStyle(el).clipPath,
                        transform: getComputedStyle(el.querySelector(".menu__link-wrapper"))
                            .transform,
                        opacity: getComputedStyle(el.querySelector(".menu__link-wrapper")).opacity,
                    });
            }
            document.querySelector(".header__menu-button").click();
            start = performance.now();
            while (performance.now() - start < 700) {
                await new Promise(requestAnimationFrame);
                const el = document.querySelector(".menu");
                result.closing.push({
                    t: performance.now() - start,
                    clipPath: el ? getComputedStyle(el).clipPath : null,
                });
            }
            return result;
        });
    }
    const animations = await page.evaluate(() => window.animationAudit);
    output.runs.push({ width, animations, menu });
    console.log(`${version} animation ${width}: ${animations.length} native animations`);
    await context.close();
}
await writeFile(`${artifactRoot}/${version}/animation.json`, JSON.stringify(output, null, 2));
await browser.close();
