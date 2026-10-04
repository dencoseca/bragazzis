import { m } from "motion/react";
import { useRef } from "react";

import shopfrontImg from "@/assets/images/shopfront.jpg?preset=fullWidth";
import { OptimizedImage } from "@/components/OptimizedImage";
import { useScrollParallax } from "@/hooks/useScrollParallax";

interface HomeShopfrontProps {
    shouldLoadImage: boolean;
}

/** The shop's red fascia, closing the page just above the footer in the same red. */
export function HomeShopfront({ shouldLoadImage }: HomeShopfrontProps) {
    const frameRef = useRef<HTMLDivElement>(null);
    const imageParallax = useScrollParallax(frameRef, {
        output: ["-12%", "0%"],
    });

    return (
        <div className="home-shopfront media-frame" ref={frameRef}>
            <m.div className="home-shopfront__inner" style={{ y: imageParallax }}>
                <OptimizedImage
                    image={shopfrontImg}
                    alt="the Bragazzi’s shopfront on Abbeydale Road"
                    sizes="100vw"
                    shouldLoad={shouldLoadImage}
                    revealOnLoad
                />
            </m.div>
        </div>
    );
}
