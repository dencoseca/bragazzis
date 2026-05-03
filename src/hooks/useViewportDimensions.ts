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

/**
 * Hook to get viewport dimensions. Now only updates once on mount to avoid jitter during resize.
 * Use useIsMobile/useIsTablet for conditional rendering.
 */
export function useViewportDimensions(): ViewportDimensions {
    const [dimensions, setDimensions] = useState<ViewportDimensions>(getViewportDimensions);

    useEffect(() => {
        setDimensions(getViewportDimensions());
    }, []);

    return dimensions;
}

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);

        // Initial check in case it changed between initialization and effect
        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [query, matches]);

    return matches;
}

export function useIsMobile(): boolean {
    return useMediaQuery(`(max-width: ${breakpoints.mobile}px)`);
}

export function useIsTablet(): boolean {
    return useMediaQuery(`(max-width: ${breakpoints.tablet}px)`);
}
