import { useScroll } from "motion/react";

import { Cover } from "@/components/Cover";
import { FloatingItems } from "@/components/FloatingItems";
import { FullWidthBanner } from "@/components/FullWidthBanner";
import { Layout } from "@/components/Layout";
import { openingHours } from "@/constants/openingHours";

export function Home() {
    const { scrollYProgress } = useScroll();

    return (
        <Layout pageTitle="Home" description="Bragazzi's — an Italian deli, café in Sheffield.">
            <Cover openingHours={openingHours} scrollYProgress={scrollYProgress} />
            <section className="home__mobile-cover" id="mobile-cover">
                <ul className="opening-hours">
                    {openingHours.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            </section>
            <section className="home__statement text--display" id="statement">
                <span>Roam freely and find inspiration...</span>
                <span>or that obscure pasta shape that you've</span>
                <span>been looking for</span>
            </section>
            <FloatingItems scrollYProgress={scrollYProgress} />
            <FullWidthBanner scrollYProgress={scrollYProgress} />
        </Layout>
    );
}
