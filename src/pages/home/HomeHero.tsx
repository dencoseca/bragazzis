import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import parmesanImg from "@/assets/images/parmesan.jpg?preset=fullWidth";
import { OptimizedImage } from "@/components/OptimizedImage";
import { introTransition } from "@/constants/animations";
import { siteConfig } from "@/constants/siteConfig";
import { useScrollParallax } from "@/hooks/useScrollParallax";

interface HomeHeroProps {
    onSettled?: () => void;
}

const HERO_INTRO_MAX_WAIT_MS = 2_500;
const DISPLAY_FONT_MAX_WAIT_MS = 1_200;
const DISPLAY_FONT = '400 1em "Instrument Serif"';

const titleVariants = {
    initial: {
        y: "125%",
    },
    animate: {
        y: "0%",
        transition: {
            ...introTransition,
            delay: 0.1,
        },
    },
};

const metaVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            ...introTransition,
            delay: 0.8,
        },
    },
};

const photoVariants = {
    initial: {
        opacity: 0,
        scale: 1.06,
    },
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            ...introTransition,
            duration: 2.4,
        },
    },
};

/** Holds the wordmark back until its typeface has loaded, so it never animates in a fallback. */
function useDisplayFontReady() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let isCurrent = true;
        const markReady = () => {
            if (isCurrent) setIsReady(true);
        };
        const timeoutId = window.setTimeout(markReady, DISPLAY_FONT_MAX_WAIT_MS);
        const fontLoad = document.fonts?.load(DISPLAY_FONT) ?? Promise.resolve();

        fontLoad.then(markReady, markReady);

        return () => {
            isCurrent = false;
            window.clearTimeout(timeoutId);
        };
    }, []);

    return isReady;
}

export function HomeHero({ onSettled }: HomeHeroProps) {
    const prefersReducedMotion = useReducedMotion();
    const heroRef = useRef<HTMLElement>(null);
    const photoRef = useRef<HTMLDivElement>(null);
    const isDisplayFontReady = useDisplayFontReady();
    const [isHeroImageReady, setIsHeroImageReady] = useState(false);
    const [hasIntroWaitElapsed, setHasIntroWaitElapsed] = useState(false);
    // The photo widens from the grid margins to full-bleed as the masthead scrolls away.
    const photoExpansion = useScrollParallax(heroRef, {
        offset: ["start start", "end end"],
        output: [0, 1],
    });
    const photoParallax = useScrollParallax(photoRef, {
        offset: ["start start", "end start"],
        output: ["0%", "16%"],
    });
    const { address } = siteConfig.business;
    const canRevealPhoto = isHeroImageReady || hasIntroWaitElapsed;
    const initialAnimationState = prefersReducedMotion ? false : "initial";

    function getAnimationState(isReady: boolean) {
        if (prefersReducedMotion) return undefined;

        return isReady ? "animate" : "initial";
    }

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
        if (canRevealPhoto) {
            onSettled?.();
        }
    }, [canRevealPhoto, onSettled]);

    return (
        <section className="home-hero" ref={heroRef}>
            <div className="home-hero__masthead">
                <h1 className="home-hero__title text--masthead">
                    <motion.span
                        className="home-hero__title-text"
                        variants={titleVariants}
                        initial={initialAnimationState}
                        animate={getAnimationState(isDisplayFontReady)}
                    >
                        Bragazzi’s
                    </motion.span>
                </h1>
                <motion.div
                    className="home-hero__meta text--label"
                    variants={metaVariants}
                    initial={initialAnimationState}
                    animate={getAnimationState(isDisplayFontReady)}
                >
                    <p>Purveyors of quality Italian goods</p>
                    <a
                        className="home-hero__address text-link"
                        href={address.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {address.streetAddress}, {address.addressLocality}
                    </a>
                    <p className="home-hero__established">Est. 2003</p>
                </motion.div>
            </div>
            <motion.div
                className="home-hero__photo"
                ref={photoRef}
                style={{ "--photo-expansion": photoExpansion }}
            >
                <motion.div
                    className="home-hero__photo-inner"
                    style={{ y: photoParallax }}
                    variants={photoVariants}
                    initial={initialAnimationState}
                    animate={getAnimationState(canRevealPhoto)}
                >
                    <OptimizedImage
                        className="home-hero__image"
                        image={parmesanImg}
                        alt="an amaretti tin displayed on wheels of Parmesan cheese"
                        sizes="100vw"
                        priority
                        revealOnLoad
                        onReady={() => setIsHeroImageReady(true)}
                        onError={() => setIsHeroImageReady(true)}
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
