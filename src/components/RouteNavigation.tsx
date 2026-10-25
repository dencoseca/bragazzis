import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

function getFragmentTarget(hash: string) {
    try {
        return hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    } catch {
        // Malformed fragments behave like a missing anchor.
        return null;
    }
}

/** Runs inside the route Suspense boundary, after destination content is ready. */
export function RouteNavigation() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const initialLocation = useRef(location);

    useLayoutEffect(() => {
        const isInitialPage = location === initialLocation.current;
        if (isInitialPage && !location.hash) return;

        // Reset before the destination paints, so a shorter page never flashes at the
        // previous page's scroll offset. The browser owns Back/Forward restoration.
        if (navigationType !== "POP" || isInitialPage) {
            const target = getFragmentTarget(location.hash);
            if (target) target.scrollIntoView({ behavior: "instant" });
            else window.scrollTo({ left: 0, top: 0, behavior: "instant" });
        }
    }, [location, navigationType]);

    useEffect(() => {
        const isInitialPage = location === initialLocation.current;
        if (isInitialPage && !location.hash) return;

        // Let the mobile menu release background inertness before moving focus.
        const frame = requestAnimationFrame(() => {
            const target = getFragmentTarget(location.hash);
            const focusTarget = target ?? document.querySelector<HTMLElement>("#main-content");
            if (focusTarget && !focusTarget.hasAttribute("tabindex")) focusTarget.tabIndex = -1;
            focusTarget?.focus({ preventScroll: true });
        });
        return () => cancelAnimationFrame(frame);
    }, [location, navigationType]);

    return null;
}
