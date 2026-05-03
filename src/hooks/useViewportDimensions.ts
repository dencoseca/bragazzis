import { useEffect, useState } from "react";

import breakpointsJson from "@/constants/breakpoints.json";
import { debounce } from "@/utils/debounce";

export interface ViewportDimensions {
    height: number;
    width: number;
    vh: number;
    vw: number;
}

export const breakpoints = breakpointsJson;

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

export function useViewportDimensions(): ViewportDimensions {
    const [dimensions, setDimensions] = useState<ViewportDimensions>(getViewportDimensions);

    useEffect(() => {
        const debouncedHandleResize = debounce(function handleResize() {
            if (window.innerWidth < breakpoints.mobile) return;
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
                vh: window.innerHeight / 100,
                vw: window.innerWidth / 100,
            });
        }, 1000);

        window.addEventListener("resize", debouncedHandleResize);
        return () => window.removeEventListener("resize", debouncedHandleResize);
    }, []);

    return dimensions;
}
