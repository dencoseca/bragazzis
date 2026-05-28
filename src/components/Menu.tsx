import { motion } from "motion/react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";

import { menuSlideTransition } from "@/constants/animations";
import type { Theme } from "@/constants/themes";

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
    theme: Theme;
}

export function Menu({ theme }: MenuProps) {
    const menuStyle = {
        "--menu-background-color": theme.palette.background,
        "--menu-content-color": theme.palette.content.primary,
    } as CSSProperties;

    return (
        <motion.div
            className="menu"
            style={menuStyle}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
        >
            <motion.div className="menu__link-wrapper" variants={linkVariants}>
                <Link className="menu__link text--menu-link" to="/">
                    Il Caffè
                </Link>
            </motion.div>
            <motion.div className="menu__link-wrapper" variants={linkVariants}>
                <Link className="menu__link text--menu-link" to="/lastoria">
                    La Storia
                </Link>
            </motion.div>
            <motion.div className="menu__link-wrapper" variants={linkVariants}>
                <Link className="menu__link text--menu-link" to="/ilgiorno">
                    Il Giorno
                </Link>
            </motion.div>
        </motion.div>
    );
}
