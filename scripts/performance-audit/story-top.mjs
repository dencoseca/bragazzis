import { mkdir, writeFile } from "node:fs/promises";

import { chromium } from "playwright";

import { artifactRoot, browserPath, siteUrl } from "./config.mjs";
const version = process.argv[2] ?? "before";
const dir = `${artifactRoot}/${version}/story-top-repeat`;
await mkdir(dir, { recursive: true });
const browser = await chromium.launch({ executablePath: browserPath, headless: true });
const data = [];
for (let run = 1; run <= 5; run++) {
    const context = await browser.newContext({
        viewport: { width: 900, height: 900 },
        deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await page.goto(`${siteUrl}/lastoria`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${dir}/${run}.png`, animations: "allow" });
    const state = await page.evaluate(() => {
        const picture = document.querySelector(".lastoria__ticket picture");
        const r = picture.getBoundingClientRect();
        const ticket = picture.closest(".lastoria__ticket");
        const track = picture.closest(".lastoria__ticket-track");
        return {
            pictureY: r.y,
            ticketOpacity: getComputedStyle(ticket).opacity,
            ticketTranslate: getComputedStyle(ticket).translate,
            trackTransform: getComputedStyle(track).transform,
            revealed: ticket.dataset.revealed,
            scrollY,
        };
    });
    data.push({ run, ...state });
    console.log(version, run, state);
    await context.close();
}
await writeFile(`${dir}/results.json`, JSON.stringify(data, null, 2));
await browser.close();
