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

        lenisRef.current = new Lenis({ autoRaf: true });

        return () => {
            destroyLenis();
        };
    }, [enabled]);

    return lenisRef;
}
