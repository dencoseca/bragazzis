import { useEffect, useRef, useState } from "react";

import ciabattaImg from "@/assets/images/ciabatta.jpg?preset=editorial";
import coffeePourImg from "@/assets/images/coffee-pour.jpg?preset=editorial";
import shelvesImg from "@/assets/images/shelves.jpg?preset=editorial";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useReveal } from "@/hooks/useReveal";
import type { OptimizedPicture } from "@/types/imagetools";

const EDITORIAL_IMAGE_SIZES = `${getBreakpointMediaQuery("mobile")} 100vw, 45vw`;
// A zero-height line across the middle of the viewport decides which chapter is current.
const ACTIVE_ITEM_ROOT_MARGIN = "-50% 0px -50% 0px";

interface HomeEditorialProps {
    shouldLoadImages: boolean;
}

interface EditorialItem {
    id: string;
    title: string;
    image: OptimizedPicture;
    alt: string;
    text: string;
}

const editorialItems: EditorialItem[] = [
    {
        id: "caffe",
        title: "Il Caffè",
        image: coffeePourImg,
        alt: "silky coffee being poured",
        text: "We use our own carefully curated blend, roasted by Darkwoods Coffee, West Yorkshire. We only use specialty graded coffee which has a cleaner and more distinct flavour than commercial coffee, and is traceable back to the skilled farmers that produce it, and their farms across the world.",
    },
    {
        id: "fornitori",
        title: "I Fornitori",
        image: ciabattaImg,
        alt: "ciabatta sandwiches being prepared",
        text: "We trade directly with suppliers in Italy. We choose to work with suppliers who focus on the quality, integrity and provenance of their produce. Year round we sell a wide range of everyday staple foods.",
    },
    {
        id: "dispensa",
        title: "La Dispensa",
        image: shelvesImg,
        alt: "Italian food and drink displayed on shop shelves",
        text: "We maintain a good supply of everyday items such as flour, dried pasta shapes, chocolates, and sauces, and our deli counter is always well stocked with DOP cheeses and cured meats. You’ll find fresh Italian eggs for making the most beautiful pasta, and fresh Italian sausage to stir through it.",
    },
];

interface EditorialChapterProps {
    item: EditorialItem;
    index: number;
    showImage: boolean;
    shouldLoadImage: boolean;
}

function EditorialChapter({ item, index, showImage, shouldLoadImage }: EditorialChapterProps) {
    const revealRef = useReveal<HTMLDivElement>();

    return (
        <li className="home-editorial__item" data-editorial-index={index}>
            {showImage ? (
                <figure className="home-editorial__item-figure media-frame">
                    <OptimizedImage
                        image={item.image}
                        alt={item.alt}
                        sizes={EDITORIAL_IMAGE_SIZES}
                        shouldLoad={shouldLoadImage}
                        revealOnLoad
                    />
                </figure>
            ) : null}
            <div className="home-editorial__item-text reveal" ref={revealRef}>
                <p className="home-editorial__index text--label" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="home-editorial__title text--heading" lang="it">
                    {item.title}
                </h2>
                <p className="home-editorial__paragraph text--body">{item.text}</p>
            </div>
        </li>
    );
}

export function HomeEditorial({ shouldLoadImages }: HomeEditorialProps) {
    const isMobile = useIsMobile();
    const listRef = useRef<HTMLOListElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Desktop and tablet hold a single picture frame beside the text and cross-fade it as each
    // chapter crosses the middle of the viewport; mobile shows each picture inline instead.
    useEffect(() => {
        if (isMobile || !("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;

                    setActiveIndex(Number((entry.target as HTMLElement).dataset.editorialIndex));
                }
            },
            { rootMargin: ACTIVE_ITEM_ROOT_MARGIN },
        );

        for (const element of listRef.current?.querySelectorAll("[data-editorial-index]") ?? []) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, [isMobile]);

    return (
        <section className="home-editorial">
            {isMobile ? null : (
                <div className="home-editorial__media">
                    <div className="home-editorial__frame media-frame">
                        {editorialItems.map((item, index) => (
                            <OptimizedImage
                                key={item.id}
                                className="home-editorial__frame-image"
                                data-active={index === activeIndex}
                                image={item.image}
                                alt={item.alt}
                                sizes={EDITORIAL_IMAGE_SIZES}
                                shouldLoad={shouldLoadImages}
                                revealOnLoad
                            />
                        ))}
                    </div>
                    <p className="home-editorial__counter text--label" aria-hidden="true">
                        {String(activeIndex + 1).padStart(2, "0")} /{" "}
                        {String(editorialItems.length).padStart(2, "0")}
                    </p>
                </div>
            )}
            <ol className="home-editorial__items" ref={listRef}>
                {editorialItems.map((item, index) => (
                    <EditorialChapter
                        key={item.id}
                        item={item}
                        index={index}
                        showImage={isMobile}
                        shouldLoadImage={shouldLoadImages}
                    />
                ))}
            </ol>
        </section>
    );
}
