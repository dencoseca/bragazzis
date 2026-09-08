import type { galleryImageMetadata } from "@/pages/il-giorno/galleryImageMetadata";

type GalleryFilename = (typeof galleryImageMetadata)[number]["filename"];
type GalleryComposition =
    | readonly [GalleryFilename]
    | readonly [GalleryFilename, GalleryFilename]
    | readonly [GalleryFilename, GalleryFilename, GalleryFilename];

// Each composition keeps its photographs together, in opening-to-closing order.
export const galleryCompositions = [
    ["aperto.jpg", "sandwich-prep-duo.jpg", "sandwich-board-plan.jpg"],
    ["olive-oil-bread.jpg", "sangers-in-baskets.jpg", "writing-cake-labels.jpg"],
    ["tom-and-joe-serving.jpg", "chicken-run-conversation.jpg", "joe-espresso-cup.jpg"],
    ["kid-opening-fridge.jpg", "busy-through-the-window.jpg", "kitchen-trio.jpg"],
    ["tom-and-joe-laughing.jpg", "cafe-view.jpg"],
    ["cutting-parma.jpg", "salad-plated.jpg", "feeding-cake.jpg"],
    ["last-goodbyes-monochrome.jpg", "joe-sweeping-overspill.jpg", "tom-filling-bucket.jpg"],
    ["jt-brings-in-chairs.jpg", "clearing-table-detritus.jpg"],
    ["tired-tom.jpg", "laughing-joe-and-leon.jpg", "leaning-matteo.jpg"],
    ["empty-cafe-closing.jpg"],
] as const satisfies readonly GalleryComposition[];
