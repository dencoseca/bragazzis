import { AnimatePresence } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { localBusinessJsonLd, siteConfig } from "@/constants/siteConfig";
import { theme, type Theme } from "@/constants/themes";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { usePrefersReducedMotion } from "@/hooks/useViewportDimensions";

interface LayoutProps {
    children: ReactNode;
    pageTitle: string;
    theme: Theme;
    headerTheme?: Theme;
    footerTheme?: Theme;
    menuTheme?: Theme;
    scrollToTopBehavior?: ScrollBehavior;
    description?: string;
}

export function Layout({
    children,
    pageTitle,
    theme: pageTheme,
    headerTheme = pageTheme,
    footerTheme = pageTheme,
    menuTheme = theme.dark,
    scrollToTopBehavior = "smooth",
    description = siteConfig.business.description,
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
    const mainThemeStyle = {
        "--theme-background-color": pageTheme.palette.background,
        "--theme-content-color": pageTheme.palette.content.primary,
    } as CSSProperties;

    useEffect(() => {
        if (mainRef.current) mainRef.current.classList.add("visible");
    }, []);

    const fullTitle = pageTitle
        ? `${pageTitle} | ${siteConfig.business.name}`
        : siteConfig.business.name;
    const canonicalUrl = `${siteConfig.business.origin}${location.pathname}`;

    return (
        <>
            <Helmet>
                <title>{fullTitle}</title>
                <link rel="canonical" href={canonicalUrl} />
                <meta name="description" content={description} />
                <meta property="og:title" content={fullTitle} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:image" content={siteConfig.assets.ogImage} />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={fullTitle} />
                <meta name="twitter:description" content={description} />
                <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
            </Helmet>
            <a href="#main-content" className="skip-to-content">
                Skip to content
            </a>
            <AnimatePresence>{menuIsOpen && <Menu theme={menuTheme} />}</AnimatePresence>
            <main id="main-content" ref={mainRef} style={mainThemeStyle}>
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
