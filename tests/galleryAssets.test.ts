import { describe, expect, test } from "vite-plus/test";

import { assertGalleryImageFilenameParity } from "../vite.gallery-assets";

describe("gallery asset validation", () => {
    test("rejects metadata without a matching asset", () => {
        expect(() => assertGalleryImageFilenameParity(["missing.jpg"], [])).toThrow(
            "metadata without asset: missing.jpg",
        );
    });

    test("rejects an asset without matching metadata", () => {
        expect(() => assertGalleryImageFilenameParity([], ["extra.jpg"])).toThrow(
            "asset without metadata: extra.jpg",
        );
    });
});
