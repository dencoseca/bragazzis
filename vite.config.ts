import { readFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

import { validateGalleryImageAssets } from "./vite.gallery-assets";
import { imageOptimizationPlugin } from "./vite.imagetools";

validateGalleryImageAssets();

const breakpointNames = ["mobile", "tablet"] as const;
const tokensScss = readFileSync(
    fileURLToPath(new URL("./src/styles/_tokens.scss", import.meta.url)),
    "utf8",
);

function getBreakpointValue(breakpoint: (typeof breakpointNames)[number]): string {
    const tokenName = `$breakpoint-${breakpoint}`;
    const tokenMatch = tokensScss.match(new RegExp(`\\${tokenName}:\\s*([^;]+);`));
    const breakpointValue = tokenMatch?.[1]?.trim();

    if (!breakpointValue) {
        throw new Error(`Missing Sass breakpoint token: ${tokenName}`);
    }

    return breakpointValue;
}

const breakpointValues = Object.fromEntries(
    breakpointNames.map((breakpoint) => [breakpoint, getBreakpointValue(breakpoint)]),
);

// https://vite.dev/config/
export default defineConfig({
    define: {
        __BREAKPOINTS__: JSON.stringify(breakpointValues),
    },
    staged: {
        "*": "vp check --fix",
    },
    test: {
        exclude: ["tests/visual/**"],
        setupFiles: ["./tests/setup.ts"],
        coverage: {
            exclude: ["src/**/*.d.ts", "src/main.tsx", "src/types/**"],
            include: ["src/**/*.{ts,tsx}"],
            provider: "v8",
            reporter: ["text", "json", "html"],
        },
    },
    lint: {
        plugins: ["import"],
        options: { typeAware: true, typeCheck: true },
        rules: {
            "import/no-default-export": "error",
        },
        overrides: [
            {
                files: ["vite.config.ts"],
                rules: {
                    "import/no-default-export": "off",
                },
            },
            {
                files: ["playwright.config.ts"],
                rules: {
                    "import/no-default-export": "off",
                },
            },
        ],
    },
    fmt: {
        tabWidth: 4,
        semi: true,
        jsdoc: true,
        sortImports: true,
        singleQuote: false,
        trailingComma: "all",
        ignorePatterns: ["dist", "pnpm-lock.yaml"],
        overrides: [
            {
                files: ["*.json", "*.yaml", "*.yml"],
                options: {
                    tabWidth: 2,
                },
            },
        ],
    },
    plugins: [react(), imageOptimizationPlugin],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
});
