import { motion, type MotionValue } from "motion/react";

import eggImg from "@/assets/images/egg.jpg?preset=fullWidth";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useScrollParallax } from "@/pages/home/useScrollParallax";

interface HomeSeasonalBannerProps {
    scrollYProgress: MotionValue<number>;
    shouldLoadImage: boolean;
}

export function HomeSeasonalBanner({ scrollYProgress, shouldLoadImage }: HomeSeasonalBannerProps) {
    const textParallax = useScrollParallax(scrollYProgress, {
        input: [0.7, 1],
        output: ["-2vh", "6vh"],
        tabletOutput: ["-1vh", "3vh"],
    });

    return (
        <section className="home-seasonal-banner">
            <OptimizedImage
                className="home-seasonal-banner__image"
                image={eggImg}
                alt="a gigantic italian chocolate easter egg"
                sizes="100vw"
                shouldLoad={shouldLoadImage}
            />
            <motion.article
                className="home-seasonal-banner__text"
                style={{ translateY: textParallax }}
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
