import { useEffect, useState } from "react";
import debounce from "@/utils/debounce";
import breakpoints from "@/constants/breakpoints.json";

export interface ViewportDimensions {
    height: number;
    width: number;
    vh: number;
    vw: number;
}

export { breakpoints };

export default function useViewportDimensions(): ViewportDimensions {
    const [dimensions, setDimensions] = useState<ViewportDimensions>(() => ({
        height: window.innerHeight,
        width: window.innerWidth,
        vh: window.innerHeight / 100,
        vw: window.innerWidth / 100,
    }));

    useEffect(() => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
    }, [dimensions]);

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
