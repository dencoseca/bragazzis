/**
 * Where each photograph sits on the twelve-column gallery grid. Consecutive placements whose
 * columns do not overlap share a row, so a `wide-left` followed by a `narrow-right` reads as a
 * pair. Keep this list aligned with `$gallery-placements` in `_il-giorno.scss`.
 */
export const galleryImagePlacements = [
    "full",
    "wide-left",
    "wide-right",
    "centre",
    "half-left",
    "half-right",
    "narrow-left",
    "narrow-right",
] as const;

export type GalleryImagePlacement = (typeof galleryImagePlacements)[number];

type GalleryImageFilename = `${string}.jpg`;

interface GalleryImageMetadata {
    filename: GalleryImageFilename;
    alt: string;
    placement: GalleryImagePlacement;
}

export const galleryImageMetadata = [
    {
        filename: "aperto.jpg",
        alt: "sandwich board sign outside cafe",
        placement: "wide-right",
    },
    {
        filename: "sandwich-prep-duo.jpg",
        alt: "people making sandwiches",
        placement: "half-left",
    },
    {
        filename: "sandwich-board-plan.jpg",
        alt: "sandwich ingredients list",
        placement: "narrow-right",
    },
    {
        filename: "olive-oil-bread.jpg",
        alt: "olive oil on bread",
        placement: "full",
    },
    {
        filename: "sangers-in-baskets.jpg",
        alt: "baskets full of sandwiches",
        placement: "wide-left",
    },
    {
        filename: "writing-cake-labels.jpg",
        alt: "writing the cake labels",
        placement: "narrow-right",
    },
    {
        filename: "tom-and-joe-serving.jpg",
        alt: "barista serving customer",
        placement: "centre",
    },
    {
        filename: "leon-serving-deli-stuff.jpg",
        alt: "serving at the deli counter",
        placement: "half-left",
    },
    {
        filename: "chicken-run-conversation.jpg",
        alt: "customers conversing",
        placement: "half-right",
    },
    {
        filename: "shelves-wide-shot.jpg",
        alt: "shelves full of italian dry goods",
        placement: "full",
    },
    { filename: "panettone.jpg", alt: "panettone", placement: "narrow-left" },
    { filename: "pasta-stacked.jpg", alt: "stacked pasta", placement: "narrow-right" },
    {
        filename: "sofa-through-window.jpg",
        alt: "customers talking",
        placement: "wide-right",
    },
    {
        filename: "joe-espresso-cup.jpg",
        alt: "serving an espresso",
        placement: "narrow-left",
    },
    {
        filename: "kid-opening-fridge.jpg",
        alt: "child choosing soft drink",
        placement: "half-right",
    },
    {
        filename: "busy-through-the-window.jpg",
        alt: "busy cafe through the window",
        placement: "full",
    },
    {
        filename: "family-on-armchairs.jpg",
        alt: "family drinking coffee",
        placement: "half-left",
    },
    {
        filename: "kitchen-trio.jpg",
        alt: "working in the kitchen",
        placement: "half-right",
    },
    {
        filename: "steve-and-jules-through-door.jpg",
        alt: "customers browsing the shelves",
        placement: "narrow-left",
    },
    { filename: "farfalle.jpg", alt: "farfalle", placement: "narrow-right" },
    { filename: "moped.jpg", alt: "moped", placement: "centre" },
    {
        filename: "tom-and-joe-laughing.jpg",
        alt: "barista laughing hard",
        placement: "wide-left",
    },
    {
        filename: "maldini-sipping-coffee.jpg",
        alt: "customer sipping coffee",
        placement: "narrow-right",
    },
    {
        filename: "customers-walking-by.jpg",
        alt: "customers looking in through the window",
        placement: "wide-right",
    },
    { filename: "cafe-view.jpg", alt: "view of the busy cafe", placement: "full" },
    { filename: "tomatoes.jpg", alt: "tomatoes", placement: "half-left" },
    { filename: "carrots.jpg", alt: "carrots", placement: "half-right" },
    { filename: "cutting-parma.jpg", alt: "cutting parma ham", placement: "narrow-left" },
    { filename: "slicing-parma.jpg", alt: "slicing parma ham", placement: "narrow-right" },
    { filename: "salad-plated.jpg", alt: "plating the salad", placement: "wide-left" },
    {
        filename: "feeding-cake.jpg",
        alt: "couple feed each other cake",
        placement: "narrow-right",
    },
    {
        filename: "joe-getting-milk.jpg",
        alt: "barista on a milk run",
        placement: "centre",
    },
    {
        filename: "jokes-in-kitchen.jpg",
        alt: "fun in the kitchen",
        placement: "wide-right",
    },
    {
        filename: "last-goodbyes-monochrome.jpg",
        alt: "saying goodbye to customers",
        placement: "full",
    },
    {
        filename: "joe-sweeping-overspill.jpg",
        alt: "sweeping the shop floor",
        placement: "half-left",
    },
    {
        filename: "tom-filling-bucket.jpg",
        alt: "barista steaming the machine",
        placement: "half-right",
    },
    {
        filename: "jt-brings-in-chairs.jpg",
        alt: "bringing in the outside chairs",
        placement: "wide-left",
    },
    {
        filename: "clearing-table-detritus.jpg",
        alt: "clearing last table",
        placement: "narrow-right",
    },
    { filename: "empty-cafe-ior.jpg", alt: "empty cafe", placement: "full" },
    { filename: "tired-tom.jpg", alt: "tired barista", placement: "half-left" },
    { filename: "tired-leon.jpg", alt: "tired barista", placement: "half-right" },
    { filename: "tired-jt.jpg", alt: "tired server", placement: "narrow-left" },
    { filename: "tired-matteo.jpg", alt: "tired owner", placement: "wide-right" },
    { filename: "tired-joe.jpg", alt: "tired server", placement: "centre" },
    { filename: "laughing-tom.jpg", alt: "laughing barista", placement: "half-left" },
    { filename: "laughing-jt.jpg", alt: "laughing server", placement: "half-right" },
    {
        filename: "laughing-joe-and-leon.jpg",
        alt: "laughing barista and server",
        placement: "wide-left",
    },
    {
        filename: "leaning-matteo.jpg",
        alt: "shot of matteo ready to leave",
        placement: "narrow-right",
    },
    {
        filename: "empty-cafe-closing.jpg",
        alt: "empty cafe at the end of the day",
        placement: "wide-left",
    },
] as const satisfies readonly GalleryImageMetadata[];
