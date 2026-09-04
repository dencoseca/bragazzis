import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/** Keep history-entry positions across route layouts and wait for lazy content to commit. */
export function RouteNavigation() {
    const location = useLocation();
    const navigationType = useNavigationType();
    // Native fragment links can reuse React Router's history key.
    const entryKey = JSON.stringify([
        location.key,
        location.pathname,
        location.search,
        location.hash,
    ]);
    const entryUrl = location.pathname + location.search + location.hash;
    const positions = useRef(new Map<string, { left: number; top: number }>());
    const initialKey = useRef(entryKey);
    const hasNavigated = useRef(false);

    useEffect(() => {
        const previous = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        return () => {
            window.history.scrollRestoration = previous;
        };
    }, []);

    useEffect(() => {
        if (entryKey !== initialKey.current) hasNavigated.current = true;
        const isInitialEntry = !hasNavigated.current;
        const saved = navigationType === "POP" ? positions.current.get(entryKey) : undefined;
        let restored = false;
        let cancelled = false;
        let frame = 0;

        function restore() {
            if (restored || document.querySelector("[data-route-loading]")) return;
            const main = document.querySelector<HTMLElement>("#main-content");
            if (!main || main.closest("[inert]")) return;
            if (document.fonts?.status === "loading") {
                void document.fonts.ready.then(() => {
                    if (!cancelled) scheduleRestore();
                });
                return;
            }

            let target: HTMLElement | null = null;
            try {
                target = location.hash
                    ? document.getElementById(decodeURIComponent(location.hash.slice(1)))
                    : null;
            } catch {
                // Malformed fragments behave like a missing anchor.
            }

            if (!isInitialEntry || target) {
                const focusTarget = target ?? main;
                if (!focusTarget.hasAttribute("tabindex")) focusTarget.tabIndex = -1;
                focusTarget.focus({ preventScroll: true });
            }
            if (saved) {
                window.scrollTo({ ...saved, behavior: "instant" });
            } else if (target) {
                target.scrollIntoView({ behavior: "instant" });
            } else if (!isInitialEntry) {
                window.scrollTo({ left: 0, top: 0, behavior: "instant" });
            }
            restored = true;
            rememberPosition();
            observer.disconnect();
        }

        function scheduleRestore() {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(restore);
        }
        function rememberPosition() {
            const currentUrl =
                window.location.pathname + window.location.search + window.location.hash;
            if (restored && currentUrl === entryUrl) {
                positions.current.set(entryKey, { left: window.scrollX, top: window.scrollY });
            }
        }

        const observer = new MutationObserver(scheduleRestore);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["inert"],
        });
        scheduleRestore();
        window.addEventListener("scroll", rememberPosition, { passive: true });
        return () => {
            cancelled = true;
            cancelAnimationFrame(frame);
            observer.disconnect();
            window.removeEventListener("scroll", rememberPosition);
        };
    }, [entryKey, entryUrl, location.hash, navigationType]);

    return null;
}
