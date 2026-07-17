import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { Menu } from "@/components/layout/Menu";
import type { ThemeName } from "@/constants/themes";

const mobileMenuId = "mobile-menu";

interface SiteNavigationProps {
    theme: ThemeName;
    menuTheme: ThemeName;
}

export function SiteNavigation({ theme, menuTheme }: SiteNavigationProps) {
    const location = useLocation();
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const menuWasOpen = useRef(false);
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    useEffect(() => {
        setMenuIsOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (menuWasOpen.current && !menuIsOpen) {
            menuButtonRef.current?.focus();
        }

        menuWasOpen.current = menuIsOpen;
    }, [menuIsOpen]);

    useEffect(() => {
        if (!menuIsOpen) return;

        const previousBodyOverflow = document.body.style.overflow;
        const previousDocumentOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        function handleMenuKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMenuIsOpen(false);
                return;
            }

            if (event.key !== "Tab") return;

            const menuLinks = Array.from(
                document.querySelectorAll<HTMLAnchorElement>(`#${mobileMenuId} a[href]`),
            );
            const firstMenuLink = menuLinks[0];
            const lastMenuLink = menuLinks.at(-1);
            const menuButton = menuButtonRef.current;

            if (!firstMenuLink || !lastMenuLink || !menuButton) return;

            if (event.shiftKey && document.activeElement === firstMenuLink) {
                event.preventDefault();
                menuButton.focus();
            } else if (event.shiftKey && document.activeElement === menuButton) {
                event.preventDefault();
                lastMenuLink.focus();
            } else if (!event.shiftKey && document.activeElement === lastMenuLink) {
                event.preventDefault();
                menuButton.focus();
            } else if (!event.shiftKey && document.activeElement === menuButton) {
                event.preventDefault();
                firstMenuLink.focus();
            }
        }

        document.addEventListener("keydown", handleMenuKeyDown);

        return () => {
            document.removeEventListener("keydown", handleMenuKeyDown);
            document.body.style.overflow = previousBodyOverflow;
            document.documentElement.style.overflow = previousDocumentOverflow;
        };
    }, [menuIsOpen]);

    function closeMenu() {
        setMenuIsOpen(false);
    }

    function toggleMenu() {
        setMenuIsOpen((isOpen) => !isOpen);
    }

    return (
        <>
            <AnimatePresence>
                {menuIsOpen ? (
                    <Menu id={mobileMenuId} theme={menuTheme} onNavigate={closeMenu} />
                ) : null}
            </AnimatePresence>
            <Header
                menuIsOpen={menuIsOpen}
                onMenuToggle={toggleMenu}
                menuButtonRef={menuButtonRef}
                menuId={mobileMenuId}
                theme={theme}
                menuTheme={menuTheme}
            />
        </>
    );
}
