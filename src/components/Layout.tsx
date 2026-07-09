import { AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { PageMeta } from "@/components/PageMeta";
import { getCanonicalUrl } from "@/constants/routes";
import { themeNames, type ThemeName } from "@/constants/themes";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { usePrefersReducedMotion } from "@/hooks/useViewportDimensions";

interface LayoutProps {
    children: ReactNode;
    pageTitle: string;
    description: string;
    theme: ThemeName;
    headerTheme?: ThemeName;
    scrollToTopBehavior?: ScrollBehavior;
}

export function Layout({
    children,
    pageTitle,
    description,
    theme: pageTheme,
    headerTheme = pageTheme,
    scrollToTopBehavior = "smooth",
}: LayoutProps) {
    const location = useLocation();

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    useEffect(() => {
        setMenuIsOpen(false);
    }, [location.pathname]);

    const handleSetMenuIsOpen = useCallback((open: boolean) => setMenuIsOpen(open), []);

    const prefersReducedMotion = usePrefersReducedMotion();
    const resolvedScrollToTopBehavior = prefersReducedMotion ? "auto" : scrollToTopBehavior;

    useSmoothScroll(!prefersReducedMotion);

    const canonicalUrl = getCanonicalUrl(location.pathname);

    return (
        <>
            <PageMeta
                pageTitle={pageTitle}
                description={description}
                canonicalUrl={canonicalUrl}
                includeLocalBusinessJsonLd
                includeOpenGraph
                includeTwitter
            />
            <a href="#main-content" className="skip-to-content">
                Skip to content
            </a>
            <AnimatePresence>{menuIsOpen && <Menu theme={themeNames.dark} />}</AnimatePresence>
            <main id="main-content" data-theme={pageTheme}>
                <Header
                    menuIsOpen={menuIsOpen}
                    setMenuIsOpen={handleSetMenuIsOpen}
                    theme={headerTheme}
                    menuTheme={themeNames.dark}
                />
                {children}
                <Footer theme={pageTheme} scrollToTopBehavior={resolvedScrollToTopBehavior} />
            </main>
        </>
    );
}
