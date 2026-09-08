import { galleryCompositions } from "@/pages/il-giorno/galleryCompositions";
import { galleryImageMetadata } from "@/pages/il-giorno/galleryImageMetadata";
import { getGallerySpreadLayout } from "@/pages/il-giorno/galleryLayout";
import type { OptimizedPicture } from "@/types/imagetools";

const galleryImageModules = import.meta.glob<OptimizedPicture>("@/assets/images/gallery/*.jpg", {
    eager: true,
    import: "default",
    query: "?preset=gallery",
});

export interface GalleryImage {
    filename: string;
    image: OptimizedPicture;
    alt: string;
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

const metadataByFilename = new Map(
    galleryImageMetadata.map((metadata) => [metadata.filename, metadata]),
);

export const gallerySpreads = galleryCompositions.map((filenames) => {
    const images: GalleryImage[] = filenames.map((filename) => {
        const image = galleryImagesByFilename.get(filename);
        const metadata = metadataByFilename.get(filename);
        if (!image || !metadata) {
            throw new Error(`Missing gallery image or metadata: ${filename}`);
        }
        return { filename, image, alt: metadata.alt };
    });
    return { images, ...getGallerySpreadLayout(images) };
});

export const galleryImages = gallerySpreads.flatMap(({ images }) => images);
