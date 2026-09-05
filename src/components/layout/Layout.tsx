import { useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { Footer } from "@/components/layout/Footer";
import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { PageMeta } from "@/components/PageMeta";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { getCanonicalUrl } from "@/constants/routes";
import { themeNames, type ThemeName } from "@/constants/themes";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

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
    const backgroundContentRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const resolvedScrollToTopBehavior = prefersReducedMotion ? "auto" : scrollToTopBehavior;

    useSmoothScroll(!prefersReducedMotion, location.key);

    const canonicalUrl = getCanonicalUrl(location.pathname);

    return (
        <>
            <PageMeta pageTitle={pageTitle} description={description} canonicalUrl={canonicalUrl} />
            <SiteNavigation
                backgroundContentRef={backgroundContentRef}
                theme={headerTheme}
                menuTheme={themeNames.dark}
            />
            <div className="layout__background" ref={backgroundContentRef}>
                <a href="#main-content" className="skip-to-content">
                    Skip to content
                </a>
                <main id="main-content" tabIndex={-1} data-theme={pageTheme}>
                    <RouteErrorBoundary>{children}</RouteErrorBoundary>
                </main>
                <Footer theme={pageTheme} scrollToTopBehavior={resolvedScrollToTopBehavior} />
            </div>
        </>
    );
}
