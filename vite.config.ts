import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

import { imageOptimizationPlugin } from "./vite.imagetools";

// https://vite.dev/config/
export default defineConfig({
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
    server: {
        open: true,
    },
});
