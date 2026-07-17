import { motion, type MotionValue, useReducedMotion, useTransform } from "motion/react";

import eggImg from "@/assets/images/egg.jpg?preset=fullWidth";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useIsMobile, useIsTablet } from "@/hooks/useMediaQuery";

interface HomeSeasonalBannerProps {
    scrollYProgress: MotionValue<number>;
}

export function HomeSeasonalBanner({ scrollYProgress }: HomeSeasonalBannerProps) {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const prefersReducedMotion = useReducedMotion();
    const textScrollLaptop = useTransform(scrollYProgress, [0.7, 1], ["-2vh", "6vh"]);
    const textScrollTablet = useTransform(scrollYProgress, [0.7, 1], ["-1vh", "3vh"]);
    const textScrollTranslateYValue =
        prefersReducedMotion || isMobile ? 0 : !isTablet ? textScrollLaptop : textScrollTablet;

    return (
        <section className="full-width-banner">
            <OptimizedImage
                className="full-width-banner__image"
                image={eggImg}
                alt="a gigantic italian chocolate easter egg"
                sizes="100vw"
            />
            <motion.article
                className="full-width-banner__text"
                style={{
                    translateY: textScrollTranslateYValue,
                }}
            >
                <span className="text--display hide-mobile">Each season brings a selection of</span>
                <span className="text--display hide-mobile">well considered products</span>
                <span className="text--display show-mobile">Each season</span>
                <span className="text--display show-mobile">brings a selection</span>
                <span className="text--display show-mobile">of well considered</span>
                <span className="text--display show-mobile">products</span>
            </motion.article>
        </section>
    );
}
