import { motion } from "motion/react";
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
    theme: ThemeName;
}

export function Menu({ theme }: MenuProps) {
    return (
        <motion.div
            className="menu"
            data-theme={theme}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
        >
            {menuNavRoutes.map((route) => (
                <motion.div key={route.path} className="menu__link-wrapper" variants={linkVariants}>
                    <Link className="menu__link text--menu-link" to={route.path}>
                        {route.label}
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
