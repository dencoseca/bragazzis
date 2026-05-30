import { expect, test, type Page } from "@playwright/test";

const VIEWPORTS = [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1280, height: 900 },
] as const;

const ROUTES = [
    { name: "home", path: "/", settleMs: 5_200 },
    { name: "lastoria", path: "/lastoria", settleMs: 1_800 },
    { name: "ilgiorno", path: "/ilgiorno", settleMs: 1_200 },
] as const;

const NOT_FOUND_ROUTE = {
    name: "not-found",
    path: "/visual-regression-404",
    settleMs: 600,
} as const;

const SCROLL_STATES = [
    { name: "top", ratio: 0 },
    { name: "mid", ratio: 0.5 },
    { name: "near-footer", ratio: 1 },
] as const;

const FLOATING_HANDOFF_VIEWPORTS = [
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1280, height: 900 },
] as const;

const VIEWPORT_IMAGE_MARGIN = 240;
const SCROLL_SETTLE_MS = 700;
const FLOATING_HANDOFF_MAX_GAP_RATIO = 0.35;

test.describe("main page visuals", () => {
    for (const route of ROUTES) {
        for (const viewport of VIEWPORTS) {
            test(`${route.name} at ${viewport.name}`, async ({ page }) => {
                await page.setViewportSize(viewport);
                await gotoRouteAndSettle(page, route.path, route.settleMs);

                for (const state of SCROLL_STATES) {
                    await scrollToRatio(page, state.ratio);
                    await waitForViewportAssets(page);
                    await page.waitForTimeout(SCROLL_SETTLE_MS);

                    await expect(page).toHaveScreenshot(
                        `${route.name}-${viewport.name}-${state.name}.png`,
                        {
                            fullPage: false,
                        },
                    );
                }
            });
        }
    }
});

test.describe("404 visuals", () => {
    for (const viewport of VIEWPORTS) {
        test(`404 at ${viewport.name}`, async ({ page }) => {
            await page.setViewportSize(viewport);
            await gotoRouteAndSettle(page, NOT_FOUND_ROUTE.path, NOT_FOUND_ROUTE.settleMs);
            await waitForViewportAssets(page);

            await expect(page).toHaveScreenshot(
                `${NOT_FOUND_ROUTE.name}-${viewport.name}-top.png`,
                {
                    fullPage: false,
                },
            );
        });
    }
});

test.describe("home floating section handoff", () => {
    for (const viewport of FLOATING_HANDOFF_VIEWPORTS) {
        test(`final floating item leads naturally into seasonal banner at ${viewport.name}`, async ({
            page,
        }) => {
            await page.setViewportSize(viewport);
            await gotoRouteAndSettle(page, "/", 5_200);
            await scrollToFloatingBannerHandoff(page);

            const gap = await measureFloatingItemToBannerGap(page);

            expect(gap).toBeLessThanOrEqual(viewport.height * FLOATING_HANDOFF_MAX_GAP_RATIO);
        });
    }
});

async function gotoRouteAndSettle(page: Page, path: string, settleMs: number) {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.waitForFunction(() =>
        Boolean(document.querySelector("main.visible, .page-not-found")),
    );
    await page.evaluate(() => document.fonts.ready);
    await waitForViewportAssets(page);
    await page.waitForTimeout(settleMs);
}

async function scrollToRatio(page: Page, ratio: number) {
    const targetTop = await page.evaluate((scrollRatio) => {
        const scrollingElement = document.scrollingElement ?? document.documentElement;
        const maxScrollTop = Math.max(0, scrollingElement.scrollHeight - window.innerHeight);
        const scrollTop = Math.round(maxScrollTop * scrollRatio);

        window.scrollTo(0, scrollTop);

        return scrollTop;
    }, ratio);

    await page.waitForFunction(
        (expectedTop) => Math.abs(window.scrollY - expectedTop) <= 2,
        targetTop,
    );
}

async function scrollToFloatingBannerHandoff(page: Page) {
    const targetTop = await page.evaluate(() => {
        const banner = document.querySelector(".full-width-banner");
        if (!banner) return 0;

        const bannerTop = banner.getBoundingClientRect().top + window.scrollY;
        const scrollTop = Math.max(0, Math.round(bannerTop - window.innerHeight * 0.9));

        window.scrollTo(0, scrollTop);

        return scrollTop;
    });

    await page.waitForFunction(
        (expectedTop) => Math.abs(window.scrollY - expectedTop) <= 2,
        targetTop,
    );
    await waitForViewportAssets(page);
    await page.waitForTimeout(SCROLL_SETTLE_MS);
}

async function measureFloatingItemToBannerGap(page: Page) {
    return page.evaluate(() => {
        const item = document.querySelector(".item--4");
        const banner = document.querySelector(".full-width-banner");

        if (!item || !banner) {
            throw new Error("Unable to find floating item or full-width banner");
        }

        return banner.getBoundingClientRect().top - item.getBoundingClientRect().bottom;
    });
}

async function waitForViewportAssets(page: Page) {
    await page.evaluate(async (viewportMargin) => {
        await document.fonts.ready;

        const viewportImages = Array.from(document.images).filter((image) => {
            const rect = image.getBoundingClientRect();

            return (
                rect.bottom >= -viewportMargin &&
                rect.top <= window.innerHeight + viewportMargin &&
                rect.right >= -viewportMargin &&
                rect.left <= window.innerWidth + viewportMargin
            );
        });

        await Promise.all(
            viewportImages.map(
                (image) =>
                    new Promise<void>((resolve) => {
                        if (image.complete) {
                            resolve();
                            return;
                        }

                        image.addEventListener("load", () => resolve(), { once: true });
                        image.addEventListener("error", () => resolve(), { once: true });
                    }),
            ),
        );
    }, VIEWPORT_IMAGE_MARGIN);

    await page.waitForLoadState("networkidle");
}
