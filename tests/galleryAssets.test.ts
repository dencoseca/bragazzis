import { describe, expect, test } from "vite-plus/test";

import {
    assertGalleryImageFilenameParity,
    validateGalleryImageAssets,
} from "../vite.gallery-assets";

describe("gallery asset validation", () => {
    test("accepts the gallery metadata and assets in the repository", () => {
        expect(validateGalleryImageAssets).not.toThrow();
    });

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
