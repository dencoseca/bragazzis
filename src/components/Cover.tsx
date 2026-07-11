import { motion, type MotionValue, useReducedMotion, useTransform } from "motion/react";
import { useCallback } from "react";

import parmesanImg from "@/assets/images/parmesan.jpg?preset=fullWidth";
import { OptimizedImage } from "@/components/OptimizedImage";
import { smoothTransition } from "@/constants/animations";
import { siteConfig } from "@/constants/siteConfig";
import { useIsMobile } from "@/hooks/useMediaQuery";

interface CoverProps {
    scrollYProgress: MotionValue<number>;
}

const contentVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            ...smoothTransition,
            delay: 1.5,
        },
    },
};

const downArrowVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: [0, 1, 1],
        translateY: [-20, 0, 0],
        transition: {
            ...smoothTransition,
            delay: 1.5,
            duration: 3,
            times: [0, 0.6, 1],
        },
    },
};

const titleVariants = {
    initial: {
        translateY: "100%",
    },
    animate: {
        translateY: 0,
        transition: {
            ...smoothTransition,
            duration: 1.4,
            delay: 0.3,
        },
    },
};

export function Cover({ scrollYProgress }: CoverProps) {
    const isMobile = useIsMobile();
    const prefersReducedMotion = useReducedMotion();
    const heroImageScroll = useTransform(scrollYProgress, [0, 1], ["0vh", "59vh"]);
    const { address } = siteConfig.business;
    const initialAnimationState = prefersReducedMotion ? false : "initial";
    const animateAnimationState = prefersReducedMotion ? undefined : "animate";

    const handleScrollDown = useCallback(() => {
        const targetId = isMobile ? "mobile-cover" : "statement";
        const target = document.getElementById(targetId);
        target?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }, [isMobile, prefersReducedMotion]);

    return (
        <div className="cover" id="cover">
            <div className="cover__title-wrapper">
                <motion.div
                    className="cover__title text--page-title"
                    variants={titleVariants}
                    initial={initialAnimationState}
                    animate={animateAnimationState}
                >
                    BRAGAZZI'S
                </motion.div>
            </div>
            <div className="cover__image-wrapper">
                <motion.div
                    className="cover__image-inner"
                    style={{
                        translateY: isMobile || prefersReducedMotion ? 0 : heroImageScroll,
                    }}
                >
                    <OptimizedImage
                        className="cover__image"
                        image={parmesanImg}
                        alt="a busy Italian cafe"
                        sizes="100vw"
                        priority
                    />
                </motion.div>
            </div>
            <motion.div
                className="cover__content"
                variants={contentVariants}
                initial={initialAnimationState}
                animate={animateAnimationState}
            >
                <ul className="opening-hours">
                    {siteConfig.openingHours.display.map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
                <div className="address">
                    <a href={address.mapsUrl} target="_blank" rel="noreferrer">
                        <p>{address.streetAddress}</p>
                        <p>{address.addressLocality}</p>
                    </a>
                </div>
            </motion.div>
            <button
                type="button"
                className="cover__down-arrow-btn"
                onClick={handleScrollDown}
                aria-label="Scroll down"
            >
                <motion.svg
                    className="cover__down-arrow"
                    variants={downArrowVariants}
                    initial={initialAnimationState}
                    animate={animateAnimationState}
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM23.5858 38.5858L17 32L18.4142 30.5858L24 36.1716V9H26V36.1716L31.5858 30.5858L33 32L26.4142 38.5858L26 39L25 40L24 39L23.5858 38.5858Z"
                        fill="currentColor"
                    />
                </motion.svg>
            </button>
        </div>
    );
}
