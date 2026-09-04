import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/** Runs inside the route Suspense boundary, after destination content is ready. */
export function RouteNavigation() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const initialLocation = useRef(location);

    useEffect(() => {
        const isInitialPage = location === initialLocation.current;
        if (isInitialPage && !location.hash) return;

        // Let the mobile menu release background inertness before moving focus.
        const frame = requestAnimationFrame(() => {
            let target: HTMLElement | null = null;
            try {
                target = location.hash
                    ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
                    : null;
            } catch {
                // Malformed fragments behave like a missing anchor.
            }
            const focusTarget = target ?? document.querySelector<HTMLElement>("#main-content");
            if (focusTarget && !focusTarget.hasAttribute("tabindex")) focusTarget.tabIndex = -1;
            focusTarget?.focus({ preventScroll: true });

            // The browser owns Back/Forward and native fragment scrolling.
            if (navigationType !== "POP" || isInitialPage) {
                if (target) target.scrollIntoView({ behavior: "instant" });
                else window.scrollTo({ left: 0, top: 0, behavior: "instant" });
            }
        });
        return () => cancelAnimationFrame(frame);
    }, [location, navigationType]);

    return null;
}
