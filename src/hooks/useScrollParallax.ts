import {
    useReducedMotion,
    useScroll,
    useTransform,
    type MotionValue,
    type UseScrollOptions,
} from "motion/react";
import type { RefObject } from "react";

import { useIsMobile, useIsTablet } from "@/hooks/useMediaQuery";

type ScrollParallaxOutputRange<T> = [T, T];

interface ScrollParallaxOptions<T> {
    offset?: UseScrollOptions["offset"];
    output: ScrollParallaxOutputRange<T>;
    tabletOutput?: ScrollParallaxOutputRange<T>;
}

const DEFAULT_OFFSET: UseScrollOptions["offset"] = ["start end", "end start"];

/**
 * Maps an element's passage through the viewport onto a parallax value, and owns the single policy
 * that scroll-linked motion is disabled on mobile and under reduced motion.
 *
 * @param target - The element whose scroll progress drives the value.
 * @param options - The Motion scroll offset (by default, from the element entering the bottom of
 *   the viewport until it leaves the top), its laptop output range, and an optional tablet output
 *   range for sections that need a smaller travel distance on tablet.
 * @returns The value to bind to a Motion `style` property, or `0` when parallax is disabled.
 */
export function useScrollParallax<T extends string | number>(
    target: RefObject<HTMLElement | null>,
    { offset = DEFAULT_OFFSET, output, tabletOutput }: ScrollParallaxOptions<T>,
): MotionValue<T> | 0 {
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const prefersReducedMotion = useReducedMotion();
    const { scrollYProgress } = useScroll({ target, offset });
    const selectedOutput = isTablet ? (tabletOutput ?? output) : output;
    const parallax = useTransform(scrollYProgress, [0, 1], selectedOutput);

    if (isMobile || prefersReducedMotion) return 0;

    return parallax;
}
