import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { gzipSync, brotliCompressSync } from "node:zlib";

import { artifactRoot } from "./config.mjs";
const [version = "before"] = process.argv.slice(2);
const dir = `${artifactRoot}/${version}/dist/assets`;
const rows = readdirSync(dir)
    .filter((f) => /\.(js|css)$/.test(f))
    .map((file) => {
        const body = readFileSync(`${dir}/${file}`);
        return {
            file,
            bytes: body.length,
            gzip: gzipSync(body).length,
            brotli: brotliCompressSync(body).length,
        };
    });
writeFileSync(`${artifactRoot}/${version}/sizes.json`, JSON.stringify(rows, null, 2));
console.table(rows);
