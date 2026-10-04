import { m } from "motion/react";
import { useRef } from "react";

import eggImg from "@/assets/images/egg.jpg?preset=editorial";
import shopChristmasImg from "@/assets/images/shop-christmas.jpg?preset=editorial";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { useReveal } from "@/hooks/useReveal";
import { useScrollParallax } from "@/hooks/useScrollParallax";

interface HomeSeasonalProps {
    shouldLoadImages: boolean;
}

export function HomeSeasonal({ shouldLoadImages }: HomeSeasonalProps) {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useReveal<HTMLHeadingElement>();
    const easterRef = useReveal<HTMLElement>();
    const christmasRef = useReveal<HTMLElement>();
    const christmasParallax = useScrollParallax(sectionRef, {
        output: ["5vw", "-9vw"],
        tabletOutput: ["3vw", "-6vw"],
    });

    return (
        <section className="home-seasonal" ref={sectionRef} aria-labelledby="home-seasonal-title">
            <p className="home-seasonal__label text--label" lang="it">
                Le Stagioni
            </p>
            <h2
                className="home-seasonal__title text--display reveal"
                id="home-seasonal-title"
                ref={headingRef}
            >
                Each season brings a selection of well considered products
            </h2>
            <figure
                className="home-seasonal__figure home-seasonal__figure--easter reveal"
                ref={easterRef}
            >
                <div className="media-frame">
                    <OptimizedImage
                        image={eggImg}
                        alt="a gigantic italian chocolate easter egg"
                        sizes={`${getBreakpointMediaQuery("mobile")} 100vw, 50vw`}
                        shouldLoad={shouldLoadImages}
                        revealOnLoad
                    />
                </div>
                <figcaption className="text--label" lang="it">
                    Pasqua
                </figcaption>
            </figure>
            <m.div
                className="home-seasonal__figure home-seasonal__figure--christmas"
                style={{ y: christmasParallax }}
            >
                <figure className="reveal" ref={christmasRef}>
                    <div className="media-frame">
                        <OptimizedImage
                            image={shopChristmasImg}
                            alt="a beautifully stocked italian dry goods shop"
                            sizes={`${getBreakpointMediaQuery("mobile")} 100vw, 34vw`}
                            shouldLoad={shouldLoadImages}
                            revealOnLoad
                        />
                    </div>
                    <figcaption className="text--label" lang="it">
                        Natale
                    </figcaption>
                </figure>
            </m.div>
        </section>
    );
}
