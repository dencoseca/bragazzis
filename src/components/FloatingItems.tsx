import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import shelvesImg from "@/assets/images/shelves.jpg";
import coffeePourImg from "@/assets/images/coffee-pour.jpg";
import ciabattaImg from "@/assets/images/ciabatta.jpg";
import shopChristmasImg from "@/assets/images/shop-christmas.jpg";

interface FloatingItemsProps {
    dimensions: { width: number; vw: number };
    breakpoints: { mobile: number };
}

export default function FloatingItems({
    dimensions: { width, vw },
    breakpoints: { mobile },
}: FloatingItemsProps) {
    const { scrollYProgress } = useScroll();
    const item1Scroll = useTransform(scrollYProgress, [0, 1], [0, vw * -59]);
    const item2Scroll = useTransform(scrollYProgress, [0, 1], [0, vw * -118]);
    const item3Scroll = useTransform(scrollYProgress, [0, 1], [0, vw * -59]);
    const item4Scroll = useTransform(scrollYProgress, [0, 1], [0, vw * -29]);

    return (
        <AnimatePresence>
            <section className="floating-items">
                <motion.article
                    className="item item--1"
                    style={{ translateY: width >= mobile ? item1Scroll : 0 }}
                >
                    <img
                        className="item__image"
                        src={shelvesImg}
                        alt="delicious focaccia sandwiches"
                        onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className="item__text">
                        <p className="text--md">
                            <span className="text--initial">We</span> are a
                            small team of people, with different interests and
                            experiences, but with a common appreciation for the
                            somewhat overlooked, and at times undervalued
                            occupation of shopkeeping, and the unrelenting
                            pursuit of making good coffee.
                        </p>
                        <p className="text--md">
                            Bragazzi's is a cafe, delicatessen and shop. We sell
                            Italian perishables and dry goods, all of which are
                            good to eat. Most people come for the sandwiches,
                            which are potent assemblies of D.O.C cheese, salami
                            and preserved vegetables.
                        </p>
                        <p className="text--md">
                            At breakfast, we have pastries. In summer we have
                            gelato. In winter, we have shelves of hard-to-find
                            Christmas produce direct from producers in Italy.
                        </p>
                    </div>
                </motion.article>
                <motion.article
                    className="item item--2"
                    style={{ translateY: width >= mobile ? item2Scroll : 0 }}
                >
                    <img
                        className="item__image"
                        src={coffeePourImg}
                        alt="silky coffee being poured"
                        onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className="item__text">
                        <p className="text--md">
                            <span className="text--initial">We</span> use our
                            own carefully curated blend, roasted by Darkwoods
                            Coffee, West Yorkshire. We only use specialty graded
                            coffee which has a cleaner and more distinct flavour
                            than commercial coffee, and is traceable back to the
                            skilled farmers that produce it, and their farms
                            across the world.
                        </p>
                    </div>
                </motion.article>
                <motion.article
                    className="item item--3"
                    style={{ translateY: width >= mobile ? item3Scroll : 0 }}
                >
                    <img
                        className="item__image"
                        src={ciabattaImg}
                        alt="fresh salad being plated"
                        onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className="item__text">
                        <p className="text--md">
                            <span className="text--initial">We</span> trade
                            directly with suppliers in Italy. We choose to work
                            with suppliers who focus on the quality, integrity
                            and provenance of their produce. Year round we sell
                            a wide range of everyday staple foods.
                        </p>
                    </div>
                </motion.article>
                <motion.article
                    className="item item--4"
                    style={{ translateY: width >= mobile ? item4Scroll : 0 }}
                >
                    <img
                        className="item__image"
                        src={shopChristmasImg}
                        alt="a beautifully stocked italian dry goods shop"
                        onContextMenu={(e) => e.preventDefault()}
                    />
                    <div className="item__text">
                        <p className="text--md">
                            <span className="text--initial">We</span> maintain a
                            good supply of everyday items such as flour, dried
                            pasta shapes, chocolates, and sauces, and our deli
                            counter is always well stocked with DOP cheeses and
                            cured meats. You'll find fresh Italian eggs for
                            making the most beautiful pasta, and fresh Italian
                            sausage to stir through it.
                        </p>
                    </div>
                </motion.article>
            </section>
        </AnimatePresence>
    );
}
