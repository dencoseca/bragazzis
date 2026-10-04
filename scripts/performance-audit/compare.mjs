import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";

import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

import { artifactRoot } from "./config.mjs";
const base = artifactRoot;
const rows = [];
const screenshots = readdirSync(`${base}/before`).filter((f) => /^\d+-.*\.png$/.test(f));
if (!screenshots.length) throw new Error("No baseline screenshots found");
for (const file of screenshots) {
    if (!existsSync(`${base}/after/${file}`))
        throw new Error(`Missing comparison screenshot: ${file}`);
    const a = PNG.sync.read(readFileSync(`${base}/before/${file}`));
    const b = PNG.sync.read(readFileSync(`${base}/after/${file}`));
    const diff = new PNG({ width: a.width, height: a.height });
    const pixels = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
        threshold: 0.1,
        includeAA: true,
    });
    let rawPixels = 0;
    for (let i = 0; i < a.data.length; i += 4)
        if (!a.data.subarray(i, i + 4).equals(b.data.subarray(i, i + 4))) rawPixels++;
    rows.push({ file, pixels, rawPixels, pct: (100 * pixels) / (a.width * a.height) });
    if (pixels) writeFileSync(`${base}/after/diff-${file}`, PNG.sync.write(diff));
}
writeFileSync(`${base}/comparison.json`, JSON.stringify(rows, null, 2));
console.log(
    JSON.stringify(
        rows.filter((r) => r.pixels || r.rawPixels),
        null,
        2,
    ),
);
console.log(
    `${rows.length} compared, ${rows.filter((r) => r.pixels === 0).length} unchanged at threshold 0.1, ${rows.filter((r) => r.rawPixels === 0).length} pixel-identical`,
);
if (existsSync(`${base}/after/animation.json`)) {
    const a = JSON.parse(readFileSync(`${base}/before/animation.json`)),
        b = JSON.parse(readFileSync(`${base}/after/animation.json`));
    for (let i = 0; i < a.runs.length; i++) {
        const normalize = (r) => r.animations.map((x) => JSON.stringify(x)).sort();
        console.log(
            "native animation configs",
            a.runs[i].width,
            JSON.stringify(normalize(a.runs[i])) === JSON.stringify(normalize(b.runs[i]))
                ? "identical"
                : "different",
        );
    }
}
