import { fileURLToPath, URL } from "node:url";

import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
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
                files: ["*.json"],
                options: {
                    tabWidth: 2,
                },
            },
        ],
    },
    plugins: [
        react(),
        ViteImageOptimizer({
            png: { quality: 80 },
            jpeg: { quality: 80 },
            jpg: { quality: 80 },
            webp: { quality: 80 },
            avif: { quality: 70 },
            svg: {
                plugins: [
                    { name: "removeDoctype" },
                    { name: "removeXMLProcInst" },
                    { name: "minifyStyles" },
                    { name: "sortAttrs" },
                    { name: "removeDimensions" },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        open: true,
    },
});
