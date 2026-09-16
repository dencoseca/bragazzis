type GalleryImageFilename = `${string}.jpg`;

interface GalleryImageMetadata {
    filename: GalleryImageFilename;
    alt: string;
}

export const galleryImageMetadata = [
    {
        filename: "aperto.jpg",
        alt: "sandwich board sign outside cafe",
    },
    {
        filename: "sandwich-prep-duo.jpg",
        alt: "people making sandwiches",
    },
    {
        filename: "sandwich-board-plan.jpg",
        alt: "sandwich ingredients list",
    },
    {
        filename: "olive-oil-bread.jpg",
        alt: "olive oil on bread",
    },
    {
        filename: "sangers-in-baskets.jpg",
        alt: "baskets full of sandwiches",
    },
    {
        filename: "writing-cake-labels.jpg",
        alt: "writing the cake labels",
    },
    {
        filename: "tom-and-joe-serving.jpg",
        alt: "barista serving customer",
    },
    {
        filename: "leon-serving-deli-stuff.jpg",
        alt: "serving at the deli counter",
    },
    {
        filename: "chicken-run-conversation.jpg",
        alt: "customers conversing",
    },
    {
        filename: "shelves-wide-shot.jpg",
        alt: "shelves full of italian dry goods",
    },
    { filename: "panettone.jpg", alt: "panettone" },
    { filename: "pasta-stacked.jpg", alt: "stacked pasta" },
    {
        filename: "sofa-through-window.jpg",
        alt: "customers talking",
    },
    {
        filename: "joe-espresso-cup.jpg",
        alt: "serving an espresso",
    },
    {
        filename: "kid-opening-fridge.jpg",
        alt: "child choosing soft drink",
    },
    {
        filename: "busy-through-the-window.jpg",
        alt: "busy cafe through the window",
    },
    {
        filename: "family-on-armchairs.jpg",
        alt: "family drinking coffee",
    },
    {
        filename: "kitchen-trio.jpg",
        alt: "working in the kitchen",
    },
    {
        filename: "steve-and-jules-through-door.jpg",
        alt: "customers browsing the shelves",
    },
    { filename: "farfalle.jpg", alt: "farfalle" },
    { filename: "moped.jpg", alt: "moped" },
    {
        filename: "tom-and-joe-laughing.jpg",
        alt: "barista laughing hard",
    },
    {
        filename: "maldini-sipping-coffee.jpg",
        alt: "customer sipping coffee",
    },
    {
        filename: "customers-walking-by.jpg",
        alt: "customers looking in through the window",
    },
    { filename: "cafe-view.jpg", alt: "view of the busy cafe" },
    { filename: "tomatoes.jpg", alt: "tomatoes" },
    { filename: "carrots.jpg", alt: "carrots" },
    { filename: "cutting-parma.jpg", alt: "cutting parma ham" },
    { filename: "slicing-parma.jpg", alt: "slicing parma ham" },
    { filename: "salad-plated.jpg", alt: "plating the salad" },
    {
        filename: "feeding-cake.jpg",
        alt: "couple feed each other cake",
    },
    {
        filename: "joe-getting-milk.jpg",
        alt: "barista on a milk run",
    },
    {
        filename: "jokes-in-kitchen.jpg",
        alt: "fun in the kitchen",
    },
    {
        filename: "last-goodbyes-monochrome.jpg",
        alt: "saying goodbye to customers",
    },
    {
        filename: "joe-sweeping-overspill.jpg",
        alt: "sweeping the shop floor",
    },
    {
        filename: "tom-filling-bucket.jpg",
        alt: "barista steaming the machine",
    },
    {
        filename: "jt-brings-in-chairs.jpg",
        alt: "bringing in the outside chairs",
    },
    {
        filename: "clearing-table-detritus.jpg",
        alt: "clearing last table",
    },
    { filename: "empty-cafe-ior.jpg", alt: "empty cafe" },
    { filename: "tired-tom.jpg", alt: "tired barista" },
    { filename: "tired-leon.jpg", alt: "tired barista" },
    { filename: "tired-jt.jpg", alt: "tired server" },
    { filename: "tired-matteo.jpg", alt: "tired owner" },
    { filename: "tired-joe.jpg", alt: "tired server" },
    { filename: "laughing-tom.jpg", alt: "laughing barista" },
    { filename: "laughing-jt.jpg", alt: "laughing server" },
    {
        filename: "laughing-joe-and-leon.jpg",
        alt: "laughing barista and server",
    },
    {
        filename: "leaning-matteo.jpg",
        alt: "shot of matteo ready to leave",
    },
    {
        filename: "empty-cafe-closing.jpg",
        alt: "empty cafe at the end of the day",
    },
] as const satisfies readonly GalleryImageMetadata[];
