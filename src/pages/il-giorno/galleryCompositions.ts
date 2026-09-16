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
    ["tom-and-joe-serving.jpg", "leon-serving-deli-stuff.jpg", "chicken-run-conversation.jpg"],
    ["shelves-wide-shot.jpg", "panettone.jpg", "pasta-stacked.jpg"],
    ["sofa-through-window.jpg", "joe-espresso-cup.jpg"],
    ["kid-opening-fridge.jpg", "busy-through-the-window.jpg"],
    ["family-on-armchairs.jpg", "kitchen-trio.jpg", "steve-and-jules-through-door.jpg"],
    ["farfalle.jpg", "moped.jpg"],
    ["tom-and-joe-laughing.jpg", "maldini-sipping-coffee.jpg", "customers-walking-by.jpg"],
    ["tomatoes.jpg", "carrots.jpg"],
    ["cutting-parma.jpg", "slicing-parma.jpg", "salad-plated.jpg"],
    ["feeding-cake.jpg", "joe-getting-milk.jpg", "jokes-in-kitchen.jpg"],
    ["last-goodbyes-monochrome.jpg", "joe-sweeping-overspill.jpg", "tom-filling-bucket.jpg"],
    ["jt-brings-in-chairs.jpg", "clearing-table-detritus.jpg", "empty-cafe-ior.jpg"],
    ["tired-tom.jpg", "tired-leon.jpg", "tired-jt.jpg"],
    ["tired-matteo.jpg", "tired-joe.jpg"],
    ["laughing-tom.jpg", "laughing-jt.jpg"],
    ["laughing-joe-and-leon.jpg", "leaning-matteo.jpg"],
    ["empty-cafe-closing.jpg"],
] as const satisfies readonly GalleryComposition[];
