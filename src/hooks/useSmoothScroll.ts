import Lenis from "lenis";
import { useEffect, useRef } from "react";

export function useSmoothScroll() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        lenisRef.current = new Lenis();
        let rafId: number;

        function raf(time: number) {
            lenisRef.current?.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenisRef.current?.destroy();
            lenisRef.current = null;
        };
    }, []);

    return lenisRef;
}
