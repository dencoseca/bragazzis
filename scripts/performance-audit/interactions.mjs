import { mkdir, writeFile } from "node:fs/promises";

import { chromium } from "playwright";

import { artifactRoot, browserPath, siteUrl } from "./config.mjs";
const version = process.argv[2] ?? "before";
await mkdir(`${artifactRoot}/${version}`, { recursive: true });
const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const output = { version, browser: browser.version(), runs: [], errors: [] };
function check(value, message) {
    if (!value) throw new Error(message);
}
for (const width of [390, 900, 1440])
    for (const reducedMotion of ["no-preference", "reduce"]) {
        const context = await browser.newContext({
            viewport: { width, height: 900 },
            reducedMotion,
            deviceScaleFactor: 1,
        });
        const page = await context.newPage();
        page.on("pageerror", (e) => output.errors.push(e.message));
        const cdp = await context.newCDPSession(page);
        await cdp.send("Network.enable");
        await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
        const records = [];
        async function record(label) {
            const state = await page.evaluate(() => ({
                path: location.pathname + location.hash,
                scrollY,
                focus:
                    document.activeElement.id || document.activeElement.getAttribute("aria-label"),
                menu: !!document.querySelector("[role=dialog]"),
                inert: !!document.querySelector(".layout__background")?.inert,
                restoration: history.scrollRestoration,
                title: document.title,
            }));
            records.push({ label, ...state });
            return state;
        }
        await page.goto(`${siteUrl}/`);
        await page.waitForTimeout(4500);
        await page.locator(".skip-to-content").focus();
        await page.keyboard.press("Enter");
        await page.waitForTimeout(500);
        check((await record("skip")).focus === "main-content", "skip focus failed");
        await page.mouse.move(width / 2, 650);
        await page.mouse.wheel(0, 700);
        await page.waitForTimeout(1600);
        check((await record("wheel")).scrollY > 0, "wheel scroll failed");
        if (width === 390) {
            await page.getByRole("button", { name: "Open menu" }).click();
            await page.waitForTimeout(1400);
            await page.getByRole("dialog").getByRole("link", { name: "La Storia" }).click();
        } else await page.locator('header nav a[href="/lastoria"]').click();
        await page.waitForTimeout(1800);
        const story = await record("navigate story");
        check(
            story.path === "/lastoria" &&
                story.focus === "main-content" &&
                !story.inert &&
                !story.menu &&
                story.scrollY === 0,
            "route/menu focus failed",
        );
        await page.evaluate(() => window.scrollTo({ top: 650, behavior: "instant" }));
        await page.waitForTimeout(300);
        await record("story scrolled");
        // Use an existing real route link; dispatching click avoids Playwright scrolling it into view.
        await page.locator('header nav a[href="/ilgiorno"]').evaluate((el) => el.click());
        await page.waitForTimeout(1600);
        check((await record("navigate gallery")).path === "/ilgiorno", "gallery navigation failed");
        await page.evaluate(() => window.scrollTo({ top: 1800, behavior: "instant" }));
        await page.waitForTimeout(300);
        await record("gallery scrolled");
        await page.goBack();
        await page.waitForTimeout(1600);
        await record("back story");
        await page.goForward();
        await page.waitForTimeout(1600);
        await record("forward gallery");
        await page.locator('header nav a[href="/"]').evaluate((el) => el.click());
        await page.waitForTimeout(4200);
        const home = await record("return home");
        check(
            home.path === "/" && home.scrollY === 0 && home.focus === "main-content",
            "return home failed",
        );
        await page.locator('header nav a[href="#visit"]').evaluate((el) => el.click());
        await page.waitForTimeout(1500);
        const visit = await record("visit anchor");
        check(visit.path === "/#visit" && visit.scrollY > 0, "visit anchor failed");
        await page.getByRole("button", { name: "Back to top" }).click();
        await page.waitForTimeout(1700);
        check((await record("back to top")).scrollY === 0, "back to top failed");
        await page.setViewportSize({ width: 760, height: 900 });
        await page.waitForTimeout(400);
        check(
            await page.getByRole("button", { name: "Open menu" }).isVisible(),
            "760 breakpoint failed",
        );
        await page.setViewportSize({ width: 761, height: 900 });
        await page.waitForTimeout(400);
        check(
            !(await page.getByRole("button", { name: "Open menu" }).isVisible()),
            "761 breakpoint failed",
        );
        output.runs.push({ width, reducedMotion, records });
        console.log(`${version} interactions ${width} ${reducedMotion} passed`);
        await context.close();
    }
await writeFile(`${artifactRoot}/${version}/interactions.json`, JSON.stringify(output, null, 2));
await browser.close();
