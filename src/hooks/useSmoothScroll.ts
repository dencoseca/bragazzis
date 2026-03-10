import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useSmoothScroll() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        lenisRef.current = new Lenis();

        function raf(time: number) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenisRef.current?.destroy();
            lenisRef.current = null;
        };
    }, []);

    return lenisRef;
}
