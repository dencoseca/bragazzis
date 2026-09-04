import { expect, test, type Page } from "@playwright/test";

async function scrollTo(page: Page, top: number) {
    await expect(page.locator(".loading-fallback")).toHaveCount(0);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), top);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(top);
}

for (const reducedMotion of ["reduce", "no-preference"] as const) {
    test.describe(`route navigation with ${reducedMotion} motion`, () => {
        test.use({ contextOptions: { reducedMotion }, viewport: { width: 1280, height: 900 } });

        test("starts new pages at the top and allows native history restoration", async ({
            page,
        }) => {
            await page.goto("/lastoria");
            await expect(page.locator(".loading-fallback")).toHaveCount(0);
            await scrollTo(page, 700);
            // Activate without Playwright scrolling the header into view first.
            await page
                .getByRole("navigation", { name: "Primary navigation" })
                .getByRole("link", { name: "Il Giorno" })
                .evaluate((link: HTMLAnchorElement) => link.click());
            await expect(page).toHaveURL(/\/ilgiorno$/);
            await expect(page.locator("#main-content")).toBeFocused();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
            await scrollTo(page, 500);
            await page.goBack();
            await expect(page).toHaveURL(/\/lastoria$/);
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(700);
            await expect(page.locator("#main-content")).toBeFocused();
            await page.goForward();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(500);
        });

        test("waits for a delayed lazy page and follows hash navigation", async ({ page }) => {
            let release = () => {};
            const gate = new Promise<void>((resolve) => {
                release = resolve;
            });
            await page.route(/\/assets\/LaStoria-.*\.js$/, async (route) => {
                await gate;
                await route.continue();
            });
            await page.goto("/ilgiorno");
            await scrollTo(page, 500);
            const requested = page.waitForRequest(/\/assets\/LaStoria-.*\.js$/);
            await page
                .getByRole("navigation", { name: "Primary navigation" })
                .getByRole("link", { name: "La Storia" })
                .evaluate((link: HTMLAnchorElement) => {
                    link.click();
                });
            await requested;
            // React keeps the previous Suspense content visible during this transition.
            await expect(
                page.getByRole("heading", { name: "IL GIORNO", exact: true }),
            ).toBeVisible();
            release();
            await expect(page).toHaveURL(/\/lastoria$/);
            await expect(page.locator(".loading-fallback")).toHaveCount(0);
            await expect(page.locator("#main-content")).toBeFocused();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
            await scrollTo(page, 500);
            await page.evaluate(() => {
                window.location.hash = "main-content";
            });
            await expect
                .poll(() =>
                    page.evaluate(() =>
                        Math.round(
                            document.querySelector("#main-content")!.getBoundingClientRect().top,
                        ),
                    ),
                )
                .toBe(0);
            await page.goBack();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(500);
            await page.goForward();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
        });

        test("distinguishes fresh fragment navigation from Back and Forward", async ({ page }) => {
            await page.goto("/lastoria");
            await scrollTo(page, 500);
            const skipLink = page.locator(".skip-to-content");
            await skipLink.evaluate((link: HTMLAnchorElement) => link.click());
            await expect(page).toHaveURL(/#main-content$/);
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
            await scrollTo(page, 700);
            await page.goBack();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(500);
            await page.goForward();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(700);
            await page.goBack();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(500);

            // This discards the forward entry and creates a new one with the same URL.
            await skipLink.evaluate((link: HTMLAnchorElement) => link.click());
            await expect(page).toHaveURL(/#main-content$/);
            await expect(page.locator("#main-content")).toBeFocused();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
            await scrollTo(page, 300);
            await page.goBack();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(500);
            await page.goForward();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(300);
        });

        test("closes the mobile menu on resize and restores usable focus and scrolling", async ({
            page,
        }) => {
            await page.setViewportSize({ width: 390, height: 844 });
            await page.goto("/lastoria");
            await page.getByRole("button", { name: "Open menu" }).click();
            await expect(page.getByRole("dialog")).toBeVisible();
            await page.setViewportSize({ width: 1280, height: 900 });
            await expect(page.getByRole("dialog")).toHaveCount(0);
            await expect(page.getByRole("link", { name: "home", exact: true })).toBeFocused();
            await expect(page.locator(".layout__background")).not.toHaveAttribute("inert");
            await expect(page.locator(".layout__background")).not.toHaveAttribute("aria-hidden");
            await scrollTo(page, 400);
        });

        test("mobile menu navigation focuses the destination", async ({ page }) => {
            await page.setViewportSize({ width: 390, height: 844 });
            await page.goto("/lastoria");
            await scrollTo(page, 500);
            await page.getByRole("button", { name: "Open menu" }).click();
            await page.getByRole("dialog").getByRole("link", { name: "Il Giorno" }).click();
            await expect(page.locator("#main-content")).toBeFocused();
            await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
            await expect(page.getByRole("dialog")).toHaveCount(0);
        });
    });
}
