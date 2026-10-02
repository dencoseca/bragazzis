import { AnimatePresence, motion } from "motion/react";
import type { Ref } from "react";
import { Link, NavLink } from "react-router-dom";

import { BrandMark } from "@/components/BrandMark";
import { quickTransition } from "@/constants/animations";
import { publicPageRoutes, siteNavRoutes, visitSectionId } from "@/constants/routes";
import type { ThemeName } from "@/constants/themes";

const menuLabelVariants = {
    initial: { opacity: 0, y: "60%" },
    animate: { opacity: 1, y: "0%" },
    exit: { opacity: 0, y: "-60%" },
};

interface HeaderProps {
    menuIsOpen: boolean;
    onMenuToggle: () => void;
    menuButtonRef: Ref<HTMLButtonElement>;
    logoLinkRef?: Ref<HTMLAnchorElement>;
    menuId: string;
    theme: ThemeName;
    menuTheme: ThemeName;
}

export function Header({
    menuIsOpen,
    onMenuToggle,
    menuButtonRef,
    logoLinkRef,
    menuId,
    theme,
    menuTheme,
}: HeaderProps) {
    const headerTheme = menuIsOpen ? menuTheme : theme;
    const menuLabel = menuIsOpen ? "Close" : "Menu";

    return (
        <header className="header" id="header" data-theme={headerTheme} data-menu-open={menuIsOpen}>
            <Link
                to={publicPageRoutes.home.path}
                className="header__logo"
                aria-label="home"
                ref={logoLinkRef}
                aria-hidden={menuIsOpen || undefined}
                inert={menuIsOpen ? true : undefined}
            >
                <BrandMark />
            </Link>
            <nav
                className="header__nav text--label"
                aria-label="Primary navigation"
                aria-hidden={menuIsOpen || undefined}
                inert={menuIsOpen ? true : undefined}
            >
                {siteNavRoutes.map((route) => (
                    <NavLink key={route.path} className="header__link" to={route.path} end>
                        {route.label}
                    </NavLink>
                ))}
                <a className="header__link header__link--visit" href={`#${visitSectionId}`}>
                    Visit
                </a>
            </nav>
            <button
                type="button"
                className="header__menu-button text--label"
                onClick={onMenuToggle}
                ref={menuButtonRef}
                aria-label={menuIsOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuIsOpen}
                aria-controls={menuId}
            >
                <AnimatePresence initial={false} mode="popLayout">
                    <motion.span
                        key={menuLabel}
                        className="header__menu-label"
                        variants={menuLabelVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={quickTransition}
                    >
                        {menuLabel}
                    </motion.span>
                </AnimatePresence>
            </button>
        </header>
    );
}
