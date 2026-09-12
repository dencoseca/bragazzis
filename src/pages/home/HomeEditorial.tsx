import ciabattaImg from "@/assets/images/ciabatta.jpg?preset=editorial";
import coffeePourImg from "@/assets/images/coffee-pour.jpg?preset=editorial";
import shelvesImg from "@/assets/images/shelves.jpg?preset=editorial";
import shopChristmasImg from "@/assets/images/shop-christmas.jpg?preset=editorial";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import type { OptimizedPicture } from "@/types/imagetools";

const EDITORIAL_IMAGE_SIZES = `${getBreakpointMediaQuery("mobile")} 100vw, 50vw`;

interface HomeEditorialProps {
    shouldLoadImages: boolean;
}

type EditorialLayout = "intro" | "coffee" | "suppliers" | "shop";

interface EditorialParagraph {
    initial?: string;
    text: string;
}

interface EditorialEntry {
    id: EditorialLayout;
    image: OptimizedPicture;
    alt: string;
    paragraphs: EditorialParagraph[];
}

interface EditorialItemProps {
    item: EditorialEntry;
    shouldLoadImage: boolean;
}

const editorialHeadings: Record<EditorialLayout, string> = {
    intro: "The occupation of shopkeeping.",
    coffee: "Making good coffee.",
    suppliers: "Quality, integrity and provenance.",
    shop: "Everyday items.",
};

const editorialLayoutClasses: Record<EditorialLayout, string> = {
    intro: "home-editorial__item--intro",
    coffee: "home-editorial__item--coffee",
    suppliers: "home-editorial__item--suppliers",
    shop: "home-editorial__item--shop",
};

const editorialItems: EditorialEntry[] = [
    {
        id: "intro",
        image: shelvesImg,
        alt: "Italian food and drink displayed on shop shelves",
        paragraphs: [
            {
                initial: "We",
                text: " are a small team of people, with different interests and experiences, but with a common appreciation for the somewhat overlooked, and at times undervalued occupation of shopkeeping, and the unrelenting pursuit of making good coffee.",
            },
            {
                text: "Bragazzi's is a cafe, delicatessen and shop. We sell Italian perishables and dry goods, all of which are good to eat. Most people come for the sandwiches, which are potent assemblies of D.O.C cheese, salami and preserved vegetables.",
            },
            {
                text: "At breakfast, we have pastries. In winter, we have shelves of hard-to-find Christmas produce direct from producers in Italy.",
            },
        ],
    },
    {
        id: "coffee",
        image: coffeePourImg,
        alt: "silky coffee being poured",
        paragraphs: [
            {
                initial: "We",
                text: " use our own carefully curated blend, roasted by Darkwoods Coffee, West Yorkshire. We only use specialty graded coffee which has a cleaner and more distinct flavour than commercial coffee, and is traceable back to the skilled farmers that produce it, and their farms across the world.",
            },
        ],
    },
    {
        id: "suppliers",
        image: ciabattaImg,
        alt: "ciabatta sandwiches being prepared",
        paragraphs: [
            {
                initial: "We",
                text: " trade directly with suppliers in Italy. We choose to work with suppliers who focus on the quality, integrity and provenance of their produce. Year round we sell a wide range of everyday staple foods.",
            },
        ],
    },
    {
        id: "shop",
        image: shopChristmasImg,
        alt: "a beautifully stocked italian dry goods shop",
        paragraphs: [
            {
                initial: "We",
                text: " maintain a good supply of everyday items such as flour, dried pasta shapes, chocolates, and sauces, and our deli counter is always well stocked with DOP cheeses and cured meats. You'll find fresh Italian eggs for making the most beautiful pasta, and fresh Italian sausage to stir through it.",
            },
        ],
    },
];

function EditorialItem({ item, shouldLoadImage }: EditorialItemProps) {
    return (
        <article className={`home-editorial__item ${editorialLayoutClasses[item.id]}`}>
            <OptimizedImage
                className="home-editorial__image"
                image={item.image}
                alt={item.alt}
                sizes={EDITORIAL_IMAGE_SIZES}
                shouldLoad={shouldLoadImage}
            />
            <div className="home-editorial__text">
                <span className="home-editorial__index" aria-hidden="true">
                    0{editorialItems.indexOf(item) + 1} /{" "}
                    {item.id === "intro" ? "Il Caffè" : item.id}
                </span>
                <h2 className="home-editorial__heading">{editorialHeadings[item.id]}</h2>
                {item.paragraphs.map((paragraph, paragraphIndex) => (
                    <p className="text--md" key={paragraphIndex}>
                        {paragraph.initial ? (
                            <span className="text--initial">{paragraph.initial}</span>
                        ) : null}
                        {paragraph.text}
                    </p>
                ))}
            </div>
        </article>
    );
}

export function HomeEditorial({ shouldLoadImages }: HomeEditorialProps) {
    return (
        <section className="home-editorial">
            {editorialItems.map((item) => (
                <EditorialItem key={item.id} item={item} shouldLoadImage={shouldLoadImages} />
            ))}
        </section>
    );
}
