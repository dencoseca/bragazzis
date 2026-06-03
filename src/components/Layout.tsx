import { AnimatePresence } from "motion/react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
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
    theme: ThemeName;
    headerTheme?: ThemeName;
    footerTheme?: ThemeName;
    menuTheme?: ThemeName;
    scrollToTopBehavior?: ScrollBehavior;
    description?: string;
}

export function Layout({
    children,
    pageTitle,
    theme: pageTheme,
    headerTheme = pageTheme,
    footerTheme = pageTheme,
    menuTheme = themeNames.dark,
    scrollToTopBehavior = "smooth",
    description,
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

    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (mainRef.current) mainRef.current.classList.add("visible");
    }, []);

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
            <AnimatePresence>{menuIsOpen && <Menu theme={menuTheme} />}</AnimatePresence>
            <main id="main-content" ref={mainRef} data-theme={pageTheme}>
                <Header
                    menuIsOpen={menuIsOpen}
                    setMenuIsOpen={handleSetMenuIsOpen}
                    theme={headerTheme}
                    menuTheme={menuTheme}
                />
                {children}
                <Footer theme={footerTheme} scrollToTopBehavior={resolvedScrollToTopBehavior} />
            </main>
        </>
    );
}
