import { expect, test } from "@playwright/test";

const laStoriaChunk = /\/assets\/LaStoria-.*\.js$/;

test.use({ viewport: { width: 1280, height: 900 } });

test("failed navigation preserves the shell and explicit reload recovers the page", async ({
    page,
}) => {
    let attempts = 0;
    await page.route(laStoriaChunk, (route) => {
        attempts += 1;
        return route.abort("failed");
    });
    await page.goto("/ilgiorno");
    await page
        .getByRole("navigation", { name: "Primary navigation" })
        .getByRole("link", { name: "La Storia" })
        .click();
    await expect(page.getByRole("heading", { name: "We couldn’t load this page." })).toBeVisible();
    await expect(page.getByRole("main")).toBeFocused();
    await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeAttached();
    expect(attempts).toBe(1);
    await page.screenshot({ path: "test-results/route-recovery-desktop.png" });
    await page.unroute(laStoriaChunk);
    const request = page.waitForRequest(laStoriaChunk);
    await page.getByRole("button", { name: "Reload page" }).click();
    await request;
    await expect(page).toHaveURL(/\/lastoria$/);
    await expect(
        page.getByText("Bragazzi's opened in Sheffield in 2003", { exact: false }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Reload page" })).toHaveCount(0);
});

test("a failed direct route remains recoverable and allows navigation away", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route(laStoriaChunk, (route) => route.abort("failed"));
    await page.goto("/lastoria");
    await expect(page.getByRole("button", { name: "Reload page" })).toBeVisible();
    await expect(page.getByRole("main")).toBeFocused();
    await page.screenshot({ path: "test-results/route-recovery-mobile.png" });
    await page.getByRole("link", { name: "Back to home", exact: true }).click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: "Reload page" })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "BRAGAZZI'S", exact: true })).toBeVisible();
});

test("failed 404 module provides a standalone recovery page", async ({ page }) => {
    await page.route(/\/assets\/NotFound-.*\.js$/, (route) => route.abort("failed"));
    await page.goto("/missing-page");
    await expect(page.getByRole("heading", { name: "We couldn’t load this page." })).toBeVisible();
    await expect(page.getByRole("main")).toBeFocused();
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Back to home", exact: true })).toHaveAttribute(
        "href",
        "/",
    );
});
