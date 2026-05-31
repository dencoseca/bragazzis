import type { OptimizedPicture } from "@/types/imagetools";

const galleryImageModules = import.meta.glob<OptimizedPicture>(
    [
        "@/assets/images/aperto.jpg",
        "@/assets/images/sandwich-prep-duo.jpg",
        "@/assets/images/sandwich-board-plan.jpg",
        "@/assets/images/olive-oil-bread.jpg",
        "@/assets/images/sangers-in-baskets.jpg",
        "@/assets/images/writing-cake-labels.jpg",
        "@/assets/images/tom-and-joe-serving.jpg",
        "@/assets/images/leon-serving-deli-stuff.jpg",
        "@/assets/images/chicken-run-conversation.jpg",
        "@/assets/images/shelves-wide-shot.jpg",
        "@/assets/images/panettone.jpg",
        "@/assets/images/pasta-stacked.jpg",
        "@/assets/images/sofa-through-window.jpg",
        "@/assets/images/joe-espresso-cup.jpg",
        "@/assets/images/kid-opening-fridge.jpg",
        "@/assets/images/busy-through-the-window.jpg",
        "@/assets/images/family-on-armchairs.jpg",
        "@/assets/images/kitchen-trio.jpg",
        "@/assets/images/steve-and-jules-through-door.jpg",
        "@/assets/images/farfalle.jpg",
        "@/assets/images/moped.jpg",
        "@/assets/images/tom-and-joe-laughing.jpg",
        "@/assets/images/maldini-sipping-coffee.jpg",
        "@/assets/images/customers-walking-by.jpg",
        "@/assets/images/cafe-view.jpg",
        "@/assets/images/tomatoes.jpg",
        "@/assets/images/carrots.jpg",
        "@/assets/images/cutting-parma.jpg",
        "@/assets/images/slicing-parma.jpg",
        "@/assets/images/salad-plated.jpg",
        "@/assets/images/feeding-cake.jpg",
        "@/assets/images/joe-getting-milk.jpg",
        "@/assets/images/jokes-in-kitchen.jpg",
        "@/assets/images/last-goodbyes-monochrome.jpg",
        "@/assets/images/joe-sweeping-overspill.jpg",
        "@/assets/images/tom-filling-bucket.jpg",
        "@/assets/images/jt-brings-in-chairs.jpg",
        "@/assets/images/clearing-table-detritus.jpg",
        "@/assets/images/empty-cafe-ior.jpg",
        "@/assets/images/tired-tom.jpg",
        "@/assets/images/tired-leon.jpg",
        "@/assets/images/tired-jt.jpg",
        "@/assets/images/tired-matteo.jpg",
        "@/assets/images/tired-joe.jpg",
        "@/assets/images/laughing-tom.jpg",
        "@/assets/images/laughing-jt.jpg",
        "@/assets/images/laughing-joe-and-leon.jpg",
        "@/assets/images/leaning-matteo.jpg",
        "@/assets/images/empty-cafe-closing.jpg",
    ],
    {
        eager: true,
        import: "default",
        query: "?preset=gallery",
    },
);

export type GalleryImageSize = 40 | 45 | 50 | 55 | 60 | 65 | 70;

type GalleryImageFilename = `${string}.jpg`;

interface GalleryImageMetadata {
    filename: GalleryImageFilename;
    alt: string;
    size: GalleryImageSize;
}

export interface GalleryImage {
    image: OptimizedPicture;
    alt: string;
    size: GalleryImageSize;
}

const galleryImageMetadata = [
    {
        filename: "aperto.jpg",
        alt: "sandwich board sign outside cafe",
        size: 60,
    },
    {
        filename: "sandwich-prep-duo.jpg",
        alt: "people making sandwiches",
        size: 60,
    },
    {
        filename: "sandwich-board-plan.jpg",
        alt: "sandwich ingredients list",
        size: 60,
    },
    {
        filename: "olive-oil-bread.jpg",
        alt: "olive oil on bread",
        size: 60,
    },
    {
        filename: "sangers-in-baskets.jpg",
        alt: "baskets full of sandwiches",
        size: 70,
    },
    {
        filename: "writing-cake-labels.jpg",
        alt: "writing the cake labels",
        size: 50,
    },
    {
        filename: "tom-and-joe-serving.jpg",
        alt: "barista serving customer",
        size: 60,
    },
    {
        filename: "leon-serving-deli-stuff.jpg",
        alt: "serving at the deli counter",
        size: 45,
    },
    {
        filename: "chicken-run-conversation.jpg",
        alt: "customers conversing",
        size: 70,
    },
    {
        filename: "shelves-wide-shot.jpg",
        alt: "shelves full of italian dry goods",
        size: 70,
    },
    { filename: "panettone.jpg", alt: "panettone", size: 50 },
    { filename: "pasta-stacked.jpg", alt: "stacked pasta", size: 40 },
    {
        filename: "sofa-through-window.jpg",
        alt: "customers talking",
        size: 50,
    },
    {
        filename: "joe-espresso-cup.jpg",
        alt: "serving an espresso",
        size: 50,
    },
    {
        filename: "kid-opening-fridge.jpg",
        alt: "child choosing soft drink",
        size: 65,
    },
    {
        filename: "busy-through-the-window.jpg",
        alt: "busy cafe through the window",
        size: 60,
    },
    {
        filename: "family-on-armchairs.jpg",
        alt: "family drinking coffee",
        size: 50,
    },
    {
        filename: "kitchen-trio.jpg",
        alt: "working in the kitchen",
        size: 60,
    },
    {
        filename: "steve-and-jules-through-door.jpg",
        alt: "customers browsing the shelves",
        size: 45,
    },
    { filename: "farfalle.jpg", alt: "farfalle", size: 40 },
    { filename: "moped.jpg", alt: "moped", size: 70 },
    {
        filename: "tom-and-joe-laughing.jpg",
        alt: "barista laughing hard",
        size: 55,
    },
    {
        filename: "maldini-sipping-coffee.jpg",
        alt: "customer sipping coffee",
        size: 50,
    },
    {
        filename: "customers-walking-by.jpg",
        alt: "customers looking in through the window",
        size: 50,
    },
    { filename: "cafe-view.jpg", alt: "view of the busy cafe", size: 70 },
    { filename: "tomatoes.jpg", alt: "tomatoes", size: 55 },
    { filename: "carrots.jpg", alt: "carrots", size: 50 },
    { filename: "cutting-parma.jpg", alt: "cutting parma ham", size: 40 },
    { filename: "slicing-parma.jpg", alt: "slicing parma ham", size: 40 },
    { filename: "salad-plated.jpg", alt: "plating the salad", size: 65 },
    {
        filename: "feeding-cake.jpg",
        alt: "couple feed each other cake",
        size: 50,
    },
    {
        filename: "joe-getting-milk.jpg",
        alt: "barista on a milk run",
        size: 60,
    },
    {
        filename: "jokes-in-kitchen.jpg",
        alt: "fun in the kitchen",
        size: 50,
    },
    {
        filename: "last-goodbyes-monochrome.jpg",
        alt: "saying goodbye to customers",
        size: 60,
    },
    {
        filename: "joe-sweeping-overspill.jpg",
        alt: "sweeping the shop floor",
        size: 50,
    },
    {
        filename: "tom-filling-bucket.jpg",
        alt: "barista steaming the machine",
        size: 50,
    },
    {
        filename: "jt-brings-in-chairs.jpg",
        alt: "bringing in the outside chairs",
        size: 55,
    },
    {
        filename: "clearing-table-detritus.jpg",
        alt: "clearing last table",
        size: 50,
    },
    { filename: "empty-cafe-ior.jpg", alt: "empty cafe", size: 65 },
    { filename: "tired-tom.jpg", alt: "tired barista", size: 55 },
    { filename: "tired-leon.jpg", alt: "tired barista", size: 50 },
    { filename: "tired-jt.jpg", alt: "tired server", size: 45 },
    { filename: "tired-matteo.jpg", alt: "tired owner", size: 45 },
    { filename: "tired-joe.jpg", alt: "tired server", size: 50 },
    { filename: "laughing-tom.jpg", alt: "laughing barista", size: 55 },
    { filename: "laughing-jt.jpg", alt: "laughing server", size: 60 },
    {
        filename: "laughing-joe-and-leon.jpg",
        alt: "laughing barista and server",
        size: 50,
    },
    {
        filename: "leaning-matteo.jpg",
        alt: "shot of matteo ready to leave",
        size: 50,
    },
    {
        filename: "empty-cafe-closing.jpg",
        alt: "empty cafe at the end of the day",
        size: 50,
    },
] as const satisfies readonly GalleryImageMetadata[];

function getGalleryImage(filename: GalleryImageFilename): OptimizedPicture {
    const image = galleryImageModules[`/src/assets/images/${filename}`];

    if (!image) {
        throw new Error(`Missing gallery image asset: ${filename}`);
    }

    return image;
}

export const galleryImages: GalleryImage[] = galleryImageMetadata.map(
    ({ filename, alt, size }) => ({
        image: getGalleryImage(filename),
        alt,
        size,
    }),
);
