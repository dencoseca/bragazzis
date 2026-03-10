import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AnimatePresence } from "motion/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Menu from "@/components/Menu";

interface LayoutProps {
    children: React.ReactNode;
    pageTitle: string;
}

export default function Layout({ children, pageTitle }: LayoutProps) {
    const location = useLocation();
    const isPageIlgiorno = location.pathname.includes("/ilgiorno");
    const mainBackgroundColor = isPageIlgiorno ? "#1d1d1d" : "#fff";

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const handleSetMenuIsOpen = useCallback(
        (open: boolean) => setMenuIsOpen(open),
        [],
    );

    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (mainRef.current) mainRef.current.classList.add("visible");
    }, []);

    return (
        <>
            <Helmet>
                <title>
                    {pageTitle ? `${pageTitle} | Bragazzi's` : "Bragazzi's"}
                </title>
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
