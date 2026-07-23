import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { menuSlideTransition } from "@/constants/animations";
import { menuNavRoutes } from "@/constants/routes";
import type { ThemeName } from "@/constants/themes";

const menuVariants = {
    closed: {
        translateX: "-100%",
        overflow: "visible" as const,
        transition: {
            ...menuSlideTransition,
            duration: 0.4,
        },
    },
    open: {
        translateX: "0%",
        overflow: "hidden" as const,
        transition: {
            ...menuSlideTransition,
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const linkVariants = {
    closed: {
        opacity: 0,
        translateX: -200,
        transition: {
            ...menuSlideTransition,
            duration: 0.4,
        },
    },
    open: {
        opacity: 1,
        translateX: 0,
        transition: {
            ...menuSlideTransition,
            duration: 0.5,
        },
    },
};

interface MenuProps {
    id: string;
    theme: ThemeName;
    onNavigate: () => void;
}

export function Menu({ id, theme, onNavigate }: MenuProps) {
    const firstLinkRef = useRef<HTMLAnchorElement>(null);

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
            {menuNavRoutes.map((route) => (
                <motion.div key={route.path} className="menu__link-wrapper" variants={linkVariants}>
                    <Link
                        className="menu__link text--menu-link"
                        to={route.path}
                        onClick={onNavigate}
                        ref={route === menuNavRoutes[0] ? firstLinkRef : undefined}
                    >
                        {route.label}
                    </Link>
                </motion.div>
            ))}
        </motion.nav>
    );
}
