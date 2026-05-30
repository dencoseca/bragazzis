import Lenis from "lenis";
import { useEffect, useRef } from "react";

export function useSmoothScroll(enabled = true) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const destroyLenis = () => {
            lenisRef.current?.destroy();
            lenisRef.current = null;
        };

        if (!enabled) {
            destroyLenis();
            return destroyLenis;
        }

        lenisRef.current = new Lenis();
        let rafId: number | null = null;

        function raf(time: number) {
            lenisRef.current?.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }

            destroyLenis();
        };
    }, [enabled]);

    return lenisRef;
}
