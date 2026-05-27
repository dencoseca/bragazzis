import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { localBusinessJsonLd, siteConfig } from "@/constants/siteConfig";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

interface LayoutProps {
    children: React.ReactNode;
    pageTitle: string;
    description?: string;
}

export function Layout({
    children,
    pageTitle,
    description = siteConfig.business.description,
}: LayoutProps) {
    const location = useLocation();
    const isPageIlgiorno = location.pathname.includes("/ilgiorno");
    const mainBackgroundColor = isPageIlgiorno ? "#1d1d1d" : "#f6f4f1";

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [prevPathname, setPrevPathname] = useState(location.pathname);
    if (location.pathname !== prevPathname) {
        setPrevPathname(location.pathname);
        setMenuIsOpen(false);
    }
    const handleSetMenuIsOpen = useCallback((open: boolean) => setMenuIsOpen(open), []);

    useSmoothScroll();

    const mainRef = useRef<HTMLElement>(null);

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
            <AnimatePresence>{menuIsOpen && <Menu />}</AnimatePresence>
            <main id="main-content" ref={mainRef} style={{ backgroundColor: mainBackgroundColor }}>
                <Header menuIsOpen={menuIsOpen} setMenuIsOpen={handleSetMenuIsOpen} />
                {children}
                <Footer />
            </main>
        </>
    );
}
