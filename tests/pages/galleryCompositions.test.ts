import { describe, expect, test } from "vite-plus/test";

import { galleryCompositions } from "@/pages/il-giorno/galleryCompositions";
import { galleryImageMetadata } from "@/pages/il-giorno/galleryImageMetadata";

describe("gallery compositions", () => {
    test("uses each selected photograph once in the original day-to-night order", () => {
        const selected = galleryCompositions.flat();
        const selection = new Set<string>(selected);
        expect(selection.size).toBe(selected.length);
        expect(selected).toEqual(
            galleryImageMetadata
                .filter(({ filename }) => selection.has(filename))
                .map(({ filename }) => filename),
        );
        expect(selected[0]).toBe("aperto.jpg");
        expect(galleryCompositions.at(-1)).toEqual(["empty-cafe-closing.jpg"]);
    });
});
