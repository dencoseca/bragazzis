import { motion, type MotionValue, useReducedMotion, useTransform } from "motion/react";

import ciabattaImg from "@/assets/images/ciabatta.jpg?preset=editorial";
import coffeePourImg from "@/assets/images/coffee-pour.jpg?preset=editorial";
import shelvesImg from "@/assets/images/shelves.jpg?preset=editorial";
import shopChristmasImg from "@/assets/images/shop-christmas.jpg?preset=editorial";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useIsMobile } from "@/hooks/useMediaQuery";
import type { OptimizedPicture } from "@/types/imagetools";

interface FloatingItemsProps {
    scrollYProgress: MotionValue<number>;
}

type FloatingItemLayout = "intro" | "coffee" | "suppliers" | "shop";

interface FloatingItemParagraph {
    initial?: string;
    text: string;
}

interface FloatingItem {
    id: FloatingItemLayout;
    layout: FloatingItemLayout;
    image: OptimizedPicture;
    alt: string;
    sizes: string;
    parallaxVw: number;
    paragraphs: FloatingItemParagraph[];
}

interface FloatingItemCardProps {
    item: FloatingItem;
    scrollYProgress: MotionValue<number>;
    isMobile: boolean;
    prefersReducedMotion: boolean;
}

const floatingItemLayoutClasses: Record<FloatingItemLayout, string> = {
    intro: "item--1",
    coffee: "item--2",
    suppliers: "item--3",
    shop: "item--4",
};

const floatingItems: FloatingItem[] = [
    {
        id: "intro",
        layout: "intro",
        image: shelvesImg,
        alt: "Italian food and drink displayed on shop shelves",
        sizes: "(max-width: 768px) 100vw, 50vw",
        parallaxVw: -59,
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
        layout: "coffee",
        image: coffeePourImg,
        alt: "silky coffee being poured",
        sizes: "(max-width: 768px) 100vw, 50vw",
        parallaxVw: -118,
        paragraphs: [
            {
                initial: "We",
                text: " use our own carefully curated blend, roasted by Darkwoods Coffee, West Yorkshire. We only use specialty graded coffee which has a cleaner and more distinct flavour than commercial coffee, and is traceable back to the skilled farmers that produce it, and their farms across the world.",
            },
        ],
    },
    {
        id: "suppliers",
        layout: "suppliers",
        image: ciabattaImg,
        alt: "ciabatta sandwiches being prepared",
        sizes: "(max-width: 768px) 100vw, 50vw",
        parallaxVw: -59,
        paragraphs: [
            {
                initial: "We",
                text: " trade directly with suppliers in Italy. We choose to work with suppliers who focus on the quality, integrity and provenance of their produce. Year round we sell a wide range of everyday staple foods.",
            },
        ],
    },
    {
        id: "shop",
        layout: "shop",
        image: shopChristmasImg,
        alt: "a beautifully stocked italian dry goods shop",
        sizes: "(max-width: 768px) 100vw, 50vw",
        parallaxVw: -29,
        paragraphs: [
            {
                initial: "We",
                text: " maintain a good supply of everyday items such as flour, dried pasta shapes, chocolates, and sauces, and our deli counter is always well stocked with DOP cheeses and cured meats. You'll find fresh Italian eggs for making the most beautiful pasta, and fresh Italian sausage to stir through it.",
            },
        ],
    },
];

function FloatingItemCard({
    item,
    scrollYProgress,
    isMobile,
    prefersReducedMotion,
}: FloatingItemCardProps) {
    const itemScroll = useTransform(scrollYProgress, [0, 1], ["0vw", `${item.parallaxVw}vw`]);

    return (
        <motion.article
            className={`item ${floatingItemLayoutClasses[item.layout]}`}
            style={{ translateY: !isMobile && !prefersReducedMotion ? itemScroll : 0 }}
        >
            <OptimizedImage
                className="item__image"
                image={item.image}
                alt={item.alt}
                sizes={item.sizes}
            />
            <div className="item__text">
                {item.paragraphs.map((paragraph, paragraphIndex) => (
                    <p className="text--md" key={paragraphIndex}>
                        {paragraph.initial ? (
                            <span className="text--initial">{paragraph.initial}</span>
                        ) : null}
                        {paragraph.text}
                    </p>
                ))}
            </div>
        </motion.article>
    );
}

export function FloatingItems({ scrollYProgress }: FloatingItemsProps) {
    const isMobile = useIsMobile();
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className="floating-items">
            {floatingItems.map((item) => (
                <FloatingItemCard
                    key={item.id}
                    item={item}
                    scrollYProgress={scrollYProgress}
                    isMobile={isMobile}
                    prefersReducedMotion={Boolean(prefersReducedMotion)}
                />
            ))}
        </section>
    );
}
