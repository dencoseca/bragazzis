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

// A shorter edit of the day, retaining the original opening-to-closing order.
const selectedGalleryFilenames = new Set([
    "aperto.jpg",
    "sandwich-prep-duo.jpg",
    "sandwich-board-plan.jpg",
    "olive-oil-bread.jpg",
    "sangers-in-baskets.jpg",
    "writing-cake-labels.jpg",
    "tom-and-joe-serving.jpg",
    "chicken-run-conversation.jpg",
    "joe-espresso-cup.jpg",
    "kid-opening-fridge.jpg",
    "busy-through-the-window.jpg",
    "kitchen-trio.jpg",
    "tom-and-joe-laughing.jpg",
    "cafe-view.jpg",
    "cutting-parma.jpg",
    "salad-plated.jpg",
    "feeding-cake.jpg",
    "last-goodbyes-monochrome.jpg",
    "joe-sweeping-overspill.jpg",
    "tom-filling-bucket.jpg",
    "jt-brings-in-chairs.jpg",
    "clearing-table-detritus.jpg",
    "tired-tom.jpg",
    "laughing-joe-and-leon.jpg",
    "leaning-matteo.jpg",
    "empty-cafe-closing.jpg",
]);

export const galleryImages: GalleryImage[] = galleryImageMetadata
    .filter(({ filename }) => selectedGalleryFilenames.has(filename))
    .map(({ filename, alt, size }) => ({
        image: galleryImagesByFilename.get(filename)!,
        alt,
        size,
    }));
