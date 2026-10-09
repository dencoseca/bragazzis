import { m, useIsPresent } from "motion/react";
import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import { OpeningHours } from "@/components/OpeningHours";
import { menuExitTransition, menuTransition } from "@/constants/animations";
import { siteNavRoutes } from "@/constants/routes";
import { siteConfig } from "@/constants/siteConfig";
import type { ThemeName } from "@/constants/themes";

const menuVariants = {
    closed: {
        clipPath: "inset(0% 0% 100% 0%)",
        transition: menuExitTransition,
    },
    open: {
        clipPath: "inset(0% 0% 0% 0%)",
        transition: {
            ...menuTransition,
            staggerChildren: 0.07,
            delayChildren: 0.15,
        },
    },
};

const itemVariants = {
    closed: {
        opacity: 0,
        y: 24,
        transition: menuExitTransition,
    },
    open: {
        opacity: 1,
        y: 0,
        transition: menuTransition,
    },
};

interface MenuProps {
    id: string;
    theme: ThemeName;
    onNavigate: () => void;
}

export function Menu({ id, theme, onNavigate }: MenuProps) {
    const isPresent = useIsPresent();
    const firstLinkRef = useRef<HTMLAnchorElement>(null);
    const { address } = siteConfig.business;

    useEffect(() => {
        firstLinkRef.current?.focus();
    }, []);

    return (
        <m.nav
            id={id}
            className="menu"
            data-theme={theme}
            aria-label="Primary navigation"
            inert={!isPresent}
            aria-hidden={!isPresent || undefined}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
        >
            <div className="menu__links">
                {siteNavRoutes.map((route, index) => (
                    <m.div key={route.path} className="menu__link-wrapper" variants={itemVariants}>
                        <NavLink
                            className="menu__link"
                            to={route.path}
                            end
                            onClick={onNavigate}
                            ref={index === 0 ? firstLinkRef : undefined}
                        >
                            <span className="menu__link-index text--label" aria-hidden="true">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="menu__link-label" lang="it">
                                {route.label}
                            </span>
                        </NavLink>
                    </m.div>
                ))}
            </div>
            <m.div className="menu__details text--label" variants={itemVariants}>
                <a className="text-link" href={address.mapsUrl} target="_blank" rel="noreferrer">
                    {address.streetAddress}, {address.addressLocality}
                </a>
                <OpeningHours />
            </m.div>
        </m.nav>
    );
}
