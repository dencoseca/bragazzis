import { defineConfig } from "@playwright/test";

const previewPort = 4173;
const baseURL = `http://127.0.0.1:${previewPort}`;

const chromiumRenderingArgs = [
    "--font-render-hinting=none",
    "--disable-font-subpixel-positioning",
    "--disable-lcd-text",
    "--force-color-profile=srgb",
];

export default defineConfig({
    testDir: "./tests/visual",
    testMatch: "**/*.visual.spec.ts",
    outputDir: "test-results",
    snapshotPathTemplate: "{testDir}/__screenshots__/{testFileName}/{arg}{ext}",
    timeout: 60_000,
    expect: {
        timeout: 10_000,
        toHaveScreenshot: {
            animations: "disabled",
            caret: "hide",
            maxDiffPixelRatio: 0.015,
            scale: "css",
            threshold: 0.2,
        },
    },
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
    use: {
        baseURL,
        browserName: "chromium",
        colorScheme: "light",
        deviceScaleFactor: 1,
        launchOptions: {
            args: chromiumRenderingArgs,
        },
        locale: "en-GB",
        screenshot: "only-on-failure",
        timezoneId: "Europe/London",
        trace: "retain-on-failure",
    },
    webServer: {
        command: `vp run build && vp preview --host 127.0.0.1 --port ${previewPort}`,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
        url: baseURL,
    },
    projects: [
        {
            name: "chromium",
        },
    ],
});
