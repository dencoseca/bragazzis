import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AnimatePresence } from "motion/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

interface LayoutProps {
    children: React.ReactNode;
    pageTitle: string;
    description?: string;
}

const LOCAL_BUSINESS_JSONLD = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://bragazzis.co.uk/#localbusiness",
    name: "Bragazzi's",
    description:
        "An Italian deli, café and cultural hub in Edinburgh, serving authentic Italian food and coffee since 1983.",
    url: "https://bragazzis.co.uk",
    telephone: "+44 131 661 9141",
    address: {
        "@type": "PostalAddress",
        streetAddress: "17 Middle Meadow Walk",
        addressLocality: "Edinburgh",
        addressRegion: "City of Edinburgh",
        postalCode: "EH1 1EL",
        addressCountry: "GB",
    },
    geo: {
        "@type": "GeoCoordinates",
        latitude: 55.9437,
        longitude: -3.1909,
    },
    image: "https://bragazzis.co.uk/favicon.svg",
    logo: "https://bragazzis.co.uk/favicon.svg",
    openingHoursSpecification: [
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
            opens: "09:00",
            closes: "15:00",
        },
        {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Friday", "Saturday"],
            opens: "09:00",
            closes: "16:15",
        },
    ],
    sameAs: [],
};

export default function Layout({
    children,
    pageTitle,
    description = "Bragazzi's — an Italian deli, café and cultural hub in Edinburgh. Discover our story, daily specials and opening hours.",
}: LayoutProps) {
    const location = useLocation();
    const isPageIlgiorno = location.pathname.includes("/ilgiorno");
    const mainBackgroundColor = isPageIlgiorno ? "#1d1d1d" : "#fff";

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const handleSetMenuIsOpen = useCallback(
        (open: boolean) => setMenuIsOpen(open),
        [],
    );

    useSmoothScroll();

    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (mainRef.current) mainRef.current.classList.add("visible");
    }, []);

    const fullTitle = pageTitle
        ? `${pageTitle} | Bragazzi's`
        : "Bragazzi's";
    const canonicalUrl = `https://bragazzis.co.uk${location.pathname}`;

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
                <meta
                    property="og:image"
                    content="https://bragazzis.co.uk/favicon.svg"
                />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={fullTitle} />
                <meta name="twitter:description" content={description} />
                <script type="application/ld+json">
                    {JSON.stringify(LOCAL_BUSINESS_JSONLD)}
                </script>
            </Helmet>
            <a href="#main-content" className="skip-to-content">
                Skip to content
            </a>
            <AnimatePresence>{menuIsOpen && <Menu />}</AnimatePresence>
            <main
                id="main-content"
                ref={mainRef}
                style={{ backgroundColor: mainBackgroundColor }}
            >
                <Header
                    menuIsOpen={menuIsOpen}
                    setMenuIsOpen={handleSetMenuIsOpen}
                />
                {children}
                <Footer />
            </main>
        </>
    );
}
