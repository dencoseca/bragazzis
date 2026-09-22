import { useCallback, useSyncExternalStore } from "react";

import { getBreakpointMediaQuery, type BreakpointName } from "@/constants/breakpoints";

function getServerSnapshot(): boolean {
    return false;
}

export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const media = window.matchMedia(query);

            media.addEventListener("change", onChange);
            return () => media.removeEventListener("change", onChange);
        },
        [query],
    );
    const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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
