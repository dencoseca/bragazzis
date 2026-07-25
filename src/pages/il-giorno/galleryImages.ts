import { galleryImageMetadata } from "@/pages/il-giorno/galleryImageMetadata";
import type { OptimizedPicture } from "@/types/imagetools";

const galleryImageModules = import.meta.glob<OptimizedPicture>("@/assets/images/gallery/*.jpg", {
    eager: true,
    import: "default",
    query: "?preset=gallery",
});

export type { GalleryImageSize } from "@/pages/il-giorno/galleryImageMetadata";

interface GalleryImage {
    image: OptimizedPicture;
    alt: string;
    size: (typeof galleryImageMetadata)[number]["size"];
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

export const galleryImages: GalleryImage[] = galleryImageMetadata.map(
    ({ filename, alt, size }) => ({
        image: galleryImagesByFilename.get(filename)!,
        alt,
        size,
    }),
);
