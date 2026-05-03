import { motion, type MotionValue, useTransform } from "motion/react";
import React from "react";

import eggImg from "@/assets/images/egg.jpg?w=480;768;1024;1440;1920&format=avif;webp;jpg&as=picture";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useViewportDimensions, useIsMobile, useIsTablet } from "@/hooks/useViewportDimensions";

interface FullWidthBannerProps {
    scrollYProgress: MotionValue<number>;
}

export function FullWidthBanner({ scrollYProgress }: FullWidthBannerProps) {
    const { vh } = useViewportDimensions();
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const textScrollLaptop = useTransform(scrollYProgress, [0.7, 1], [vh * -2, vh * 6]);
    const textScrollTablet = useTransform(scrollYProgress, [0.7, 1], [vh * -1, vh * 3]);
    const textScrollTranslateYValue = !isTablet
        ? textScrollLaptop
        : !isMobile
          ? textScrollTablet
          : 0;

    return (
        <section className="full-width-banner">
            <OptimizedImage
                className="full-width-banner__image"
                image={eggImg}
                alt="a gigantic italian chocolate easter egg"
                sizes="100vw"
                onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
            />
            <motion.article
                className="full-width-banner__text"
                style={{
                    translateY: textScrollTranslateYValue,
                    translateX: "-50%",
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
