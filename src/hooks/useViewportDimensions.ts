import { useEffect, useState } from "react";

import { breakpoints } from "@/constants/breakpoints";

export interface ViewportDimensions {
    height: number;
    width: number;
    vh: number;
    vw: number;
}

export { breakpoints };

function getViewportDimensions(): ViewportDimensions {
    if (typeof window === "undefined") {
        return { height: 0, width: 0, vh: 0, vw: 0 };
    }

    return {
        height: window.innerHeight,
        width: window.innerWidth,
        vh: window.innerHeight / 100,
        vw: window.innerWidth / 100,
    };
}

function viewportDimensionsAreEqual(
    currentDimensions: ViewportDimensions,
    nextDimensions: ViewportDimensions,
): boolean {
    return (
        currentDimensions.height === nextDimensions.height &&
        currentDimensions.width === nextDimensions.width
    );
}

/**
 * Hook to get viewport dimensions. Updates on resize/orientation changes with
 * requestAnimationFrame. Use useIsMobile/useIsTablet for breakpoint-based conditional rendering.
 */
export function useViewportDimensions(): ViewportDimensions {
    const [dimensions, setDimensions] = useState<ViewportDimensions>(getViewportDimensions);

    useEffect(() => {
        if (typeof window === "undefined") return;

        let animationFrame: number | null = null;

        const updateDimensions = () => {
            animationFrame = null;
            setDimensions((currentDimensions) => {
                const nextDimensions = getViewportDimensions();

                return viewportDimensionsAreEqual(currentDimensions, nextDimensions)
                    ? currentDimensions
                    : nextDimensions;
            });
        };

        const requestUpdate = () => {
            if (animationFrame !== null) return;
            animationFrame = window.requestAnimationFrame(updateDimensions);
        };

        requestUpdate();
        window.addEventListener("resize", requestUpdate);
        window.addEventListener("orientationchange", requestUpdate);

        return () => {
            if (animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
            }

            window.removeEventListener("resize", requestUpdate);
            window.removeEventListener("orientationchange", requestUpdate);
        };
    }, []);

    return dimensions;
}

function getMediaQueryMatches(query: string): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
}

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => getMediaQueryMatches(query));

    useEffect(() => {
        if (typeof window === "undefined") return;

        const media = window.matchMedia(query);
        const updateMatches = () => setMatches(media.matches);

        updateMatches();
        media.addEventListener("change", updateMatches);
        return () => media.removeEventListener("change", updateMatches);
    }, [query]);

    return matches;
}

export function useIsMobile(): boolean {
    return useMediaQuery(`(max-width: ${breakpoints.mobile}px)`);
}

export function useIsTablet(): boolean {
    return useMediaQuery(`(max-width: ${breakpoints.tablet}px)`);
}

export function usePrefersReducedMotion(): boolean {
    return useMediaQuery("(prefers-reduced-motion: reduce)");
}
