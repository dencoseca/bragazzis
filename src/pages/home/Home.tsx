import { useCallback, useState } from "react";

import { HomeContinue } from "@/pages/home/HomeContinue";
import { HomeEditorial } from "@/pages/home/HomeEditorial";
import { HomeHero } from "@/pages/home/HomeHero";
import { HomeIntro } from "@/pages/home/HomeIntro";
import { HomeSeasonal } from "@/pages/home/HomeSeasonal";
import { HomeShopfront } from "@/pages/home/HomeShopfront";

export function Home() {
    const [shouldLoadBelowFoldImages, setShouldLoadBelowFoldImages] = useState(false);
    const handleHeroSettled = useCallback(() => {
        setShouldLoadBelowFoldImages(true);
    }, []);

    return (
        <>
            <HomeHero onSettled={handleHeroSettled} />
            <HomeIntro shouldLoadImage={shouldLoadBelowFoldImages} />
            <HomeEditorial shouldLoadImages={shouldLoadBelowFoldImages} />
            <HomeSeasonal shouldLoadImages={shouldLoadBelowFoldImages} />
            <HomeContinue shouldLoadImages={shouldLoadBelowFoldImages} />
            <HomeShopfront shouldLoadImage={shouldLoadBelowFoldImages} />
        </>
    );
}
