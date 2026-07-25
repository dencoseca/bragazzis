import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { galleryImageMetadata } from "./src/pages/il-giorno/galleryImageMetadata";

const galleryAssetsDirectory = fileURLToPath(
    new URL("./src/assets/images/gallery/", import.meta.url),
);

function getDuplicates(values: readonly string[]) {
    const seenValues = new Set<string>();
    const duplicateValues = new Set<string>();

    for (const value of values) {
        if (seenValues.has(value)) {
            duplicateValues.add(value);
        }

        seenValues.add(value);
    }

    return [...duplicateValues].sort();
}

function getDifference(values: readonly string[], comparisonValues: ReadonlySet<string>) {
    return values.filter((value) => !comparisonValues.has(value)).sort();
}

export function assertGalleryImageFilenameParity(
    metadataFilenames: readonly string[],
    assetFilenames: readonly string[],
) {
    const metadataFilenameSet = new Set(metadataFilenames);
    const assetFilenameSet = new Set(assetFilenames);
    const mismatches = [
        ["duplicate metadata filenames", getDuplicates(metadataFilenames)],
        ["duplicate asset filenames", getDuplicates(assetFilenames)],
        ["metadata without asset", getDifference(metadataFilenames, assetFilenameSet)],
        ["asset without metadata", getDifference(assetFilenames, metadataFilenameSet)],
    ] as const;
    const mismatchMessages = mismatches
        .filter(([, filenames]) => filenames.length > 0)
        .map(([label, filenames]) => `${label}: ${filenames.join(", ")}`);

    if (mismatchMessages.length > 0) {
        throw new Error(
            `Gallery image metadata and assets are out of sync:\n${mismatchMessages.join("\n")}`,
        );
    }
}

export function validateGalleryImageAssets() {
    const metadataFilenames = galleryImageMetadata.map(({ filename }) => filename);
    const assetFilenames = readdirSync(galleryAssetsDirectory, {
        withFileTypes: true,
    })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".jpg"))
        .map(({ name }) => name);

    assertGalleryImageFilenameParity(metadataFilenames, assetFilenames);
}
