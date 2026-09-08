import { motion, type MotionValue, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

import parmesanImg from "@/assets/images/parmesan.jpg?preset=fullWidth";
import { OptimizedImage } from "@/components/OptimizedImage";
import { smoothTransition } from "@/constants/animations";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { siteConfig } from "@/constants/siteConfig";
import { useScrollParallax } from "@/pages/home/useScrollParallax";

interface HomeHeroProps {
    scrollYProgress: MotionValue<number>;
    onSettled?: () => void;
}

const HERO_INTRO_MAX_WAIT_MS = 2_500;
const HERO_IMAGE_SIZES = `${getBreakpointMediaQuery("mobile")} 100vw, 55vw`;

const contentVariants = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            ...smoothTransition,
            delay: 0.15,
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
            duration: 0.6,
            delay: 0,
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
    const prefersReducedMotion = useReducedMotion();
    const [isHeroImageReady, setIsHeroImageReady] = useState(false);
    const [hasIntroWaitElapsed, setHasIntroWaitElapsed] = useState(false);
    const heroImageParallax = useScrollParallax(scrollYProgress, {
        input: [0, 1],
        output: ["0vh", "5vh"],
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
                <div className="home-hero__strapline">
                    <span>Cafe, delicatessen and shop</span>
                    <span>Sheffield · Est. 2003</span>
                </div>
                <div className="home-hero__spread">
                    <motion.div
                        className="home-hero__content"
                        variants={contentVariants}
                        initial={initialAnimationState}
                        animate={animateAnimationState}
                    >
                        <p className="home-hero__eyebrow">Il Caffè</p>
                        <h2 className="home-hero__headline">
                            Roam freely and find inspiration...
                            <br />
                            <em>or that obscure pasta shape that you've been looking for</em>
                        </h2>
                        <div className="home-hero__address">
                            <a href={address.mapsUrl} target="_blank" rel="noreferrer">
                                <span>{address.streetAddress}</span>
                                <span>{address.addressLocality} ↗</span>
                            </a>
                        </div>
                        <div className="home-hero__scroll-cue">
                            <span>Il Caffè</span>
                            <span aria-hidden="true">↓</span>
                        </div>
                    </motion.div>
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
                                onError={() => setIsHeroImageReady(true)}
                            />
                        </motion.div>
                        <span className="home-hero__image-caption">
                            All of which are good to eat.
                        </span>
                    </div>
                </div>
            </div>
            <section
                className="home-hero__mobile-cover"
                id="mobile-cover"
                aria-label="Opening hours"
            >
                <span className="home-hero__hours-label">Opening hours</span>
                <OpeningHours />
            </section>
            <div id="statement" className="home-hero__statement" />
        </>
    );
}
