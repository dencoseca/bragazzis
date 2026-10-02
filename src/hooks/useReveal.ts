import { useCallback, type RefCallback } from "react";

const REVEAL_ROOT_MARGIN = "0px 0px -8% 0px";

let revealObserver: IntersectionObserver | undefined;

function getRevealObserver() {
    revealObserver ??= new IntersectionObserver(
        (entries, observer) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;

                (entry.target as HTMLElement).dataset.revealed = "true";
                observer.unobserve(entry.target);
            }
        },
        { rootMargin: REVEAL_ROOT_MARGIN },
    );

    return revealObserver;
}

/**
 * Marks an element with `data-revealed="true"` the first time it enters the viewport, so the
 * `.reveal` transition in `_motion.scss` can play. Every element shares one observer, and the
 * reveal is a CSS transition so reduced-motion preferences and screenshot tooling settle it.
 *
 * @returns A ref callback to attach to the element that should reveal.
 */
export function useReveal<T extends HTMLElement>(): RefCallback<T> {
    return useCallback((element: T | null) => {
        if (!element) return;

        if (!("IntersectionObserver" in window)) {
            element.dataset.revealed = "true";
            return;
        }

        const observer = getRevealObserver();
        observer.observe(element);

        return () => observer.unobserve(element);
    }, []);
}
