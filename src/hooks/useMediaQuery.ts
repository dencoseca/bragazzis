import { useEffect, useState } from "react";

import { getBreakpointMediaQuery, type BreakpointName } from "@/constants/breakpoints";

function getMediaQueryMatches(query: string): boolean {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
}

function useMediaQuery(query: string): boolean {
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

function useBreakpointMediaQuery(breakpoint: BreakpointName): boolean {
    return useMediaQuery(getBreakpointMediaQuery(breakpoint));
}

export function useIsMobile(): boolean {
    return useBreakpointMediaQuery("mobile");
}

export function useIsTablet(): boolean {
    return useBreakpointMediaQuery("tablet");
}
