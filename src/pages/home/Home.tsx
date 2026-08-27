import { useScroll } from "motion/react";
import { useCallback, useState } from "react";

import { HomeEditorial } from "@/pages/home/HomeEditorial";
import { HomeHero } from "@/pages/home/HomeHero";
import { HomeSeasonalBanner } from "@/pages/home/HomeSeasonalBanner";

export function Home() {
    const { scrollYProgress } = useScroll();
    const [shouldLoadBelowFoldImages, setShouldLoadBelowFoldImages] = useState(false);
    const handleHeroSettled = useCallback(() => {
        setShouldLoadBelowFoldImages(true);
    }, []);

    return (
        <>
            <HomeHero scrollYProgress={scrollYProgress} onSettled={handleHeroSettled} />
            <HomeEditorial
                scrollYProgress={scrollYProgress}
                shouldLoadImages={shouldLoadBelowFoldImages}
            />
            <HomeSeasonalBanner
                scrollYProgress={scrollYProgress}
                shouldLoadImage={shouldLoadBelowFoldImages}
            />
        </>
    );
}
