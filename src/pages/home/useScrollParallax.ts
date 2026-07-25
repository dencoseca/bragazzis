import { useReducedMotion, useTransform, type MotionValue } from "motion/react";

import { useIsMobile, useIsTablet } from "@/hooks/useMediaQuery";

type ScrollParallaxInputRange = [number, number];
type ScrollParallaxOutputRange = [string, string];

interface ScrollParallaxOptions {
    input: ScrollParallaxInputRange;
    output: ScrollParallaxOutputRange;
    tabletOutput?: ScrollParallaxOutputRange;
}

/**
 * Maps a shared scroll progress value onto a viewport-relative parallax offset, and owns the single
 * policy that parallax is disabled on mobile and under reduced motion.
 *
 * @param scrollYProgress - The scroll progress subscription shared by all Home sections.
 * @param options - The parallax input range, its laptop output range, and an optional tablet output
 *   range for sections that need a smaller travel distance on tablet.
 * @returns The parallax offset to bind to a Motion `style` value, or `0` when parallax is disabled.
 */
export function useScrollParallax(
    scrollYProgress: MotionValue<number>,
    { input, output, tabletOutput }: ScrollParallaxOptions,
): MotionValue<string> | number {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const prefersReducedMotion = useReducedMotion();
    const laptopParallax = useTransform(scrollYProgress, input, output);
    const tabletParallax = useTransform(scrollYProgress, input, tabletOutput ?? output);

    if (isMobile || prefersReducedMotion) return 0;

    return isTablet ? tabletParallax : laptopParallax;
}
