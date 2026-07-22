import { useScroll } from "motion/react";

import { HomeEditorial } from "@/pages/home/HomeEditorial";
import { HomeHero } from "@/pages/home/HomeHero";
import { HomeSeasonalBanner } from "@/pages/home/HomeSeasonalBanner";

export function Home() {
    const { scrollYProgress } = useScroll();

    return (
        <>
            <HomeHero scrollYProgress={scrollYProgress} />
            <HomeEditorial scrollYProgress={scrollYProgress} />
            <HomeSeasonalBanner scrollYProgress={scrollYProgress} />
        </>
    );
}
