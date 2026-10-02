import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
    const firstLinkRef = useRef<HTMLAnchorElement>(null);
    const { address } = siteConfig.business;

    useEffect(() => {
        firstLinkRef.current?.focus();
    }, []);

    return (
        <motion.nav
            id={id}
            className="menu"
            data-theme={theme}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
        >
            <div className="menu__links">
                {siteNavRoutes.map((route, index) => (
                    <motion.div
                        key={route.path}
                        className="menu__link-wrapper"
                        variants={itemVariants}
                    >
                        <Link
                            className="menu__link"
                            to={route.path}
                            onClick={onNavigate}
                            ref={index === 0 ? firstLinkRef : undefined}
                        >
                            <span className="menu__link-index text--label" aria-hidden="true">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="menu__link-label">{route.label}</span>
                        </Link>
                    </motion.div>
                ))}
            </div>
            <motion.div className="menu__details text--label" variants={itemVariants}>
                <a className="text-link" href={address.mapsUrl} target="_blank" rel="noreferrer">
                    {address.streetAddress}, {address.addressLocality}
                </a>
                <OpeningHours />
            </motion.div>
        </motion.nav>
    );
}
