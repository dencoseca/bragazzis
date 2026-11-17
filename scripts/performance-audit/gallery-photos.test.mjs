/** @vitest-environment happy-dom */

import { expect, test } from "vite-plus/test";

import { readGalleryPhotos } from "./gallery-photos.mjs";

test("only counts decoded gallery photos when fallback SVGs also report natural dimensions", async () => {
    const gallery = document.createElement("div");
    document.body.append(gallery);
    try {
        for (const [src, error] of [
            ["https://example.test/photo.webp", false],
            ["data:image/svg+xml,%3Csvg/%3E", false],
            ["data:image/svg+xml,%3Csvg/%3E", true],
            ["https://example.test/corrupt.webp", false],
        ]) {
            const picture = document.createElement("picture");
            picture.dataset.galleryIndex = String(gallery.childElementCount);
            if (error) picture.dataset.imageError = "true";
            const image = document.createElement("img");
            Object.defineProperties(image, {
                currentSrc: { value: src },
                complete: { value: true },
                naturalWidth: { value: 640 },
                decode: {
                    value: async () => {
                        if (src.endsWith("corrupt.webp")) throw new Error("Decode failed");
                    },
                },
            });
            picture.append(image);
            gallery.append(picture);
        }
        expect((await readGalleryPhotos()).map((image) => image.loaded)).toEqual([
            true,
            false,
            false,
            false,
        ]);
    } finally {
        gallery.remove();
    }
});
