import { useReducedMotion, useScroll } from "motion/react";
import { useCallback } from "react";

import { Cover } from "@/components/Cover";
import { FloatingItems } from "@/components/FloatingItems";
import { FullWidthBanner } from "@/components/FullWidthBanner";
import { Layout } from "@/components/Layout";
import { OpeningHours } from "@/components/OpeningHours";
import { publicPageRoutes } from "@/constants/routes";
import { themeNames } from "@/constants/themes";
import { useIsMobile } from "@/hooks/useMediaQuery";

const HOME_ROUTE = publicPageRoutes.home;

export function Home() {
    const { scrollYProgress } = useScroll();
    const isMobile = useIsMobile();
    const prefersReducedMotion = useReducedMotion();

    const handleScrollDown = useCallback(() => {
        const targetId = isMobile ? "mobile-cover" : "statement";
        const target = document.getElementById(targetId);
        target?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }, [isMobile, prefersReducedMotion]);

    return (
        <Layout
            pageTitle={HOME_ROUTE.pageTitle}
            description={HOME_ROUTE.description}
            theme={themeNames.light}
            headerTheme={themeNames.dark}
        >
            <Cover scrollYProgress={scrollYProgress} onScrollDown={handleScrollDown} />
            <section className="home__mobile-cover" id="mobile-cover">
                <OpeningHours />
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
