import { useScroll } from "motion/react";

import { Layout } from "@/components/layout/Layout";
import { publicPageRoutes } from "@/constants/routes";
import { themeNames } from "@/constants/themes";
import { HomeEditorial } from "@/pages/home/HomeEditorial";
import { HomeHero } from "@/pages/home/HomeHero";
import { HomeSeasonalBanner } from "@/pages/home/HomeSeasonalBanner";

const HOME_ROUTE = publicPageRoutes.home;

export function Home() {
    const { scrollYProgress } = useScroll();

    return (
        <Layout
            pageTitle={HOME_ROUTE.pageTitle}
            description={HOME_ROUTE.description}
            theme={themeNames.light}
            headerTheme={themeNames.dark}
        >
            <HomeHero scrollYProgress={scrollYProgress} />
            <HomeEditorial scrollYProgress={scrollYProgress} />
            <HomeSeasonalBanner scrollYProgress={scrollYProgress} />
        </Layout>
    );
}
