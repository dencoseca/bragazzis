import { motion, type MotionValue, useTransform } from "motion/react";
import React from "react";

import ciabattaImg from "@/assets/images/ciabatta.jpg?w=360;540;720;960;1200&format=avif;webp;jpg&as=picture";
import coffeePourImg from "@/assets/images/coffee-pour.jpg?w=360;540;720;960;1200&format=avif;webp;jpg&as=picture";
import shelvesImg from "@/assets/images/shelves.jpg?w=360;540;720;960;1200&format=avif;webp;jpg&as=picture";
import shopChristmasImg from "@/assets/images/shop-christmas.jpg?w=360;540;720;960;1200&format=avif;webp;jpg&as=picture";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useViewportDimensions, useIsMobile } from "@/hooks/useViewportDimensions";

interface FloatingItemsProps {
    scrollYProgress: MotionValue<number>;
}

export function FloatingItems({ scrollYProgress }: FloatingItemsProps) {
    const { vw } = useViewportDimensions();
    const isMobile = useIsMobile();
    const item1Scroll = useTransform(scrollYProgress, [0, 1], [0, vw * -59]);
    const item2Scroll = useTransform(scrollYProgress, [0, 1], [0, vw * -118]);
    const item3Scroll = useTransform(scrollYProgress, [0, 1], [0, vw * -59]);
    const item4Scroll = useTransform(scrollYProgress, [0, 1], [0, vw * -29]);

    return (
        <section className="floating-items">
            <motion.article
                className="item item--1"
                style={{ translateY: !isMobile ? item1Scroll : 0 }}
            >
                <OptimizedImage
                    className="item__image"
                    image={shelvesImg}
                    alt="delicious focaccia sandwiches"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                />
                <div className="item__text">
                    <p className="text--md">
                        <span className="text--initial">We</span> are a small team of people, with
                        different interests and experiences, but with a common appreciation for the
                        somewhat overlooked, and at times undervalued occupation of shopkeeping, and
                        the unrelenting pursuit of making good coffee.
                    </p>
                    <p className="text--md">
                        Bragazzi's is a cafe, delicatessen and shop. We sell Italian perishables and
                        dry goods, all of which are good to eat. Most people come for the
                        sandwiches, which are potent assemblies of D.O.C cheese, salami and
                        preserved vegetables.
                    </p>
                    <p className="text--md">
                        At breakfast, we have pastries. In winter, we have shelves of hard-to-find
                        Christmas produce direct from producers in Italy.
                    </p>
                </div>
            </motion.article>
            <motion.article
                className="item item--2"
                style={{ translateY: !isMobile ? item2Scroll : 0 }}
            >
                <OptimizedImage
                    className="item__image"
                    image={coffeePourImg}
                    alt="silky coffee being poured"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                />
                <div className="item__text">
                    <p className="text--md">
                        <span className="text--initial">We</span> use our own carefully curated
                        blend, roasted by Darkwoods Coffee, West Yorkshire. We only use specialty
                        graded coffee which has a cleaner and more distinct flavour than commercial
                        coffee, and is traceable back to the skilled farmers that produce it, and
                        their farms across the world.
                    </p>
                </div>
            </motion.article>
            <motion.article
                className="item item--3"
                style={{ translateY: !isMobile ? item3Scroll : 0 }}
            >
                <OptimizedImage
                    className="item__image"
                    image={ciabattaImg}
                    alt="fresh salad being plated"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                />
                <div className="item__text">
                    <p className="text--md">
                        <span className="text--initial">We</span> trade directly with suppliers in
                        Italy. We choose to work with suppliers who focus on the quality, integrity
                        and provenance of their produce. Year round we sell a wide range of everyday
                        staple foods.
                    </p>
                </div>
            </motion.article>
            <motion.article
                className="item item--4"
                style={{ translateY: !isMobile ? item4Scroll : 0 }}
            >
                <OptimizedImage
                    className="item__image"
                    image={shopChristmasImg}
                    alt="a beautifully stocked italian dry goods shop"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                />
                <div className="item__text">
                    <p className="text--md">
                        <span className="text--initial">We</span> maintain a good supply of everyday
                        items such as flour, dried pasta shapes, chocolates, and sauces, and our
                        deli counter is always well stocked with DOP cheeses and cured meats. You'll
                        find fresh Italian eggs for making the most beautiful pasta, and fresh
                        Italian sausage to stir through it.
                    </p>
                </div>
            </motion.article>
        </section>
    );
}
