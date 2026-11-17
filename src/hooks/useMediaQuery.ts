import { useMemo, useSyncExternalStore } from "react";

import { getBreakpointMediaQuery, type BreakpointName } from "@/constants/breakpoints";

function getServerSnapshot(): boolean {
    return false;
}

export function useMediaQuery(query: string): boolean {
    const { subscribe, getSnapshot } = useMemo(() => {
        let media: MediaQueryList;
        const getMedia = () => (media ??= window.matchMedia(query));

        return {
            subscribe(onChange: () => void) {
                const list = getMedia();
                list.addEventListener("change", onChange);
                return () => list.removeEventListener("change", onChange);
            },
            getSnapshot: () => getMedia().matches,
        };
    }, [query]);

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
