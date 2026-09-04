import Lenis from "lenis";
import { useEffect } from "react";

export function useSmoothScroll(enabled = true, navigationKey?: string): void {
    useEffect(() => {
        if (!enabled) return;

        const lenis = new Lenis({ autoRaf: true });

        return () => {
            lenis.destroy();
        };
    }, [enabled, navigationKey]);
}
