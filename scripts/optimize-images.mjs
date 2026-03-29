/**
 * Image optimisation script
 *
 * Processes all JPEG and PNG images in src/assets/images/:
 *
 * 1. Resizes any image wider than 1920px down to 1920px (suitable for 2× retina at
 *    ~960px max display).
 * 2. Generates a WebP version alongside each original.
 *
 * Run with: node scripts/optimize-images.mjs
 */

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = path.resolve(__dirname, "../src/assets/images");
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 80;

async function optimizeImages() {
    const files = await readdir(IMAGES_DIR);
    const imageFiles = files.filter(
        (f) => /\.(jpe?g|png)$/i.test(f) && !f.endsWith(".webp"),
    );

    console.log(`Found ${imageFiles.length} images to process.\n`);

    let resized = 0;
    let webpCreated = 0;

    for (const file of imageFiles) {
        const filePath = path.join(IMAGES_DIR, file);
        const ext = path.extname(file);
        const baseName = path.basename(file, ext);
        const webpPath = path.join(IMAGES_DIR, `${baseName}.webp`);

        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Resize if wider than MAX_WIDTH
        if (metadata.width && metadata.width > MAX_WIDTH) {
            const before = (await stat(filePath)).size;
            await sharp(filePath)
                .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                .toFile(filePath + ".tmp");

            // Replace original with resized version
            const { rename } = await import("node:fs/promises");
            await rename(filePath + ".tmp", filePath);

            const after = (await stat(filePath)).size;
            console.log(
                `  ↓ Resized ${file}: ${metadata.width}px → ${MAX_WIDTH}px (${formatBytes(before)} → ${formatBytes(after)})`,
            );
            resized++;
        }

        // Generate WebP
        await sharp(filePath)
            .resize({ width: MAX_WIDTH, withoutEnlargement: true })
            .webp({ quality: WEBP_QUALITY })
            .toFile(webpPath);

        const webpSize = (await stat(webpPath)).size;
        const origSize = (await stat(filePath)).size;
        console.log(
            `  ✓ ${file} → ${baseName}.webp (${formatBytes(origSize)} → ${formatBytes(webpSize)})`,
        );
        webpCreated++;
    }

    console.log(`\nDone! Resized: ${resized}, WebP created: ${webpCreated}`);
}

function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

optimizeImages().catch(console.error);
