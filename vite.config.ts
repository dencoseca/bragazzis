import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import { defineConfig } from "vite-plus";

// https://vite.dev/config/
export default defineConfig({
    staged: {
        "*": "vp check --fix",
    },
    lint: { options: { typeAware: true, typeCheck: true } },
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
    plugins: [react(), imagetools()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        open: true,
    },
});
