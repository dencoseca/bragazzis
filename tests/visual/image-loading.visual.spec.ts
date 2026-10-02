import { expect, test } from "@playwright/test";

test("hero image failure leaves the fallback, intro and navigation available", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.route(/\/assets\/parmesan-.*\.(avif|jpg)/, (route) => route.abort());
    await page.goto("/");
    const hero = page.locator(".home-hero__image");
    await expect(hero).toHaveAttribute("data-image-error", "true");
    await expect(
        hero.getByRole("img", { name: /Image unavailable: an amaretti tin/ }),
    ).toBeVisible();
    await expect(hero).toHaveCSS("opacity", "1");
    await expect(page.locator(".home-hero__photo-inner")).toHaveCSS("opacity", "1");
    await expect(page.getByRole("heading", { name: "Bragazzi’s", exact: true })).toBeVisible();
    await expect(page.locator(".home-editorial__frame-image source").first()).toBeAttached();
    for (const image of await page
        .locator(".home-editorial__frame-image img, .home-seasonal img, .home-shopfront img")
        .all()) {
        await expect(image).toHaveAttribute("loading", "lazy");
    }
    await page
        .getByRole("navigation", { name: "Primary navigation" })
        .getByRole("link", { name: "Visit" })
        .click();
    await expect(page.getByRole("contentinfo")).toBeInViewport();
});
