import { expect, test } from "@playwright/test";

test("hero image failure leaves the fallback, intro and navigation available", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.route(/\/assets\/coffee-display-.*\.(avif|jpg)/, (route) => route.abort());
    await page.goto("/");
    const hero = page.locator(".home-hero__image");
    await expect(hero).toHaveAttribute("data-image-error", "true");
    await expect(
        hero.getByRole("img", { name: /Image unavailable: Bragazzi’s coffee bags/ }),
    ).toBeVisible();
    await expect(hero).toHaveCSS("opacity", "1");
    await expect(page.locator(".home-hero__content")).toHaveCSS("opacity", "1");
    await expect(page.getByRole("heading", { name: "BRAGAZZI'S", exact: true })).toBeVisible();
    await expect(page.locator(".home-editorial__image source").first()).toBeAttached();
    for (const image of await page
        .locator(".home-editorial__image img, .home-seasonal-banner img")
        .all()) {
        await expect(image).toHaveAttribute("loading", "lazy");
    }
    await page.mouse.wheel(0, 700);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});
