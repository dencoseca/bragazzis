import {
    galleryImageMetadata,
    type GalleryImageSize,
} from "@/pages/il-giorno/galleryImageMetadata";
import type { OptimizedPicture } from "@/types/imagetools";

const galleryImageModules = import.meta.glob<OptimizedPicture>("@/assets/images/gallery/*.jpg", {
    eager: true,
    import: "default",
    query: "?preset=gallery",
});

export type { GalleryImageSize } from "@/pages/il-giorno/galleryImageMetadata";

interface GalleryImage {
    filename: string;
    image: OptimizedPicture;
    alt: string;
    size: GalleryImageSize;
}

function getGalleryImageFilename(modulePath: string) {
    return modulePath.slice(modulePath.lastIndexOf("/") + 1);
}

const galleryImagesByFilename = new Map(
    Object.entries(galleryImageModules).map(([modulePath, image]) => [
        getGalleryImageFilename(modulePath),
        image,
    ]),
);

function getGalleryImage(filename: string) {
    const image = galleryImagesByFilename.get(filename);

    if (!image) {
        throw new Error(`Missing gallery image asset: ${filename}`);
    }

    return image;
}

export const galleryImages: GalleryImage[] = galleryImageMetadata.map(
    ({ filename, alt, size }) => ({
        filename,
        image: getGalleryImage(filename),
        alt,
        size,
    }),
);
