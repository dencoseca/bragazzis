import { motion, type MotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import parmesanImg from "@/assets/images/parmesan.jpg?preset=fullWidth";
import { OptimizedImage } from "@/components/OptimizedImage";
import { smoothTransition } from "@/constants/animations";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { siteConfig } from "@/constants/siteConfig";
import { useIsMobile } from "@/hooks/useMediaQuery";
import { useScrollParallax } from "@/pages/home/useScrollParallax";

interface HomeHeroProps {
    scrollYProgress: MotionValue<number>;
    onSettled?: () => void;
}

const HERO_INTRO_MAX_WAIT_MS = 2_500;
const HERO_IMAGE_SIZES = `${getBreakpointMediaQuery("mobile")} 200vw, 100vw`;

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

function OpeningHours() {
    return (
        <ul className="home-hero__opening-hours">
            {siteConfig.openingHours.display.map((line, index) => (
                <li key={index}>{line}</li>
            ))}
        </ul>
    );
}

export function HomeHero({ scrollYProgress, onSettled }: HomeHeroProps) {
    const isMobile = useIsMobile();
    const prefersReducedMotion = useReducedMotion();
    const [isHeroImageReady, setIsHeroImageReady] = useState(false);
    const [hasIntroWaitElapsed, setHasIntroWaitElapsed] = useState(false);
    const mobileCoverRef = useRef<HTMLElement>(null);
    const statementRef = useRef<HTMLElement>(null);
    const heroImageParallax = useScrollParallax(scrollYProgress, {
        input: [0, 1],
        output: ["0vh", "59vh"],
    });
    const { address } = siteConfig.business;
    const canStartIntro = isHeroImageReady || hasIntroWaitElapsed;
    const initialAnimationState = prefersReducedMotion ? false : "initial";
    const animateAnimationState = prefersReducedMotion
        ? undefined
        : canStartIntro
          ? "animate"
          : "initial";

    useEffect(() => {
        if (isHeroImageReady) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setHasIntroWaitElapsed(true);
        }, HERO_INTRO_MAX_WAIT_MS);

        return () => window.clearTimeout(timeoutId);
    }, [isHeroImageReady]);

    useEffect(() => {
        if (canStartIntro) {
            onSettled?.();
        }
    }, [canStartIntro, onSettled]);

    function handleScrollDown() {
        const target = isMobile ? mobileCoverRef.current : statementRef.current;
        target?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    }

    return (
        <>
            <div className="home-hero" id="cover">
                <div className="home-hero__title-wrapper">
                    <motion.h1
                        className="home-hero__title text--page-title"
                        variants={titleVariants}
                        initial={initialAnimationState}
                        animate={animateAnimationState}
                    >
                        BRAGAZZI'S
                    </motion.h1>
                </div>
                <div className="home-hero__image-wrapper">
                    <motion.div
                        className="home-hero__image-inner"
                        style={{ translateY: heroImageParallax }}
                    >
                        <OptimizedImage
                            className="home-hero__image"
                            image={parmesanImg}
                            alt="an amaretti tin displayed on wheels of Parmesan cheese"
                            sizes={HERO_IMAGE_SIZES}
                            priority
                            revealOnLoad
                            onReady={() => setIsHeroImageReady(true)}
                        />
                    </motion.div>
                </div>
                <motion.div
                    className="home-hero__content"
                    variants={contentVariants}
                    initial={initialAnimationState}
                    animate={animateAnimationState}
                >
                    <OpeningHours />
                    <div className="home-hero__address">
                        <a href={address.mapsUrl} target="_blank" rel="noreferrer">
                            <p>{address.streetAddress}</p>
                            <p>{address.addressLocality}</p>
                        </a>
                    </div>
                </motion.div>
                <button
                    type="button"
                    className="home-hero__down-arrow-btn"
                    onClick={handleScrollDown}
                    aria-label="Scroll down"
                >
                    <motion.svg
                        className="home-hero__down-arrow"
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
            <section className="home-hero__mobile-cover" id="mobile-cover" ref={mobileCoverRef}>
                <OpeningHours />
            </section>
            <section
                className="home-hero__statement text--display"
                id="statement"
                ref={statementRef}
            >
                <span>Roam freely and find inspiration...</span>
                <span>or that obscure pasta shape that you've</span>
                <span>been looking for</span>
            </section>
        </>
    );
}
