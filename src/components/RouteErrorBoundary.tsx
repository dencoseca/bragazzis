import { useEffect, useRef, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link, useLocation } from "react-router-dom";

import { publicPageRoutes } from "@/constants/routes";

function RouteErrorMessage() {
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Wait for the navigation menu to release background inertness.
        const frame = requestAnimationFrame(() => {
            messageRef.current?.closest("main")?.focus({ preventScroll: true });
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="route-error" ref={messageRef}>
            <h1>We couldn’t load this page.</h1>
            <p>Please check your connection and reload to try again.</p>
            <button type="button" onClick={() => window.location.reload()}>
                Reload page
            </button>
            <Link to={publicPageRoutes.home.path}>Back to home</Link>
        </div>
    );
}

interface RouteErrorBoundaryProps {
    children: ReactNode;
    standalone?: boolean;
}

export function RouteErrorBoundary({ children, standalone = false }: RouteErrorBoundaryProps) {
    const { pathname } = useLocation();
    const message = <RouteErrorMessage />;

    return (
        <ErrorBoundary
            key={pathname}
            fallback={
                standalone ? (
                    <main id="main-content" tabIndex={-1}>
                        {message}
                    </main>
                ) : (
                    message
                )
            }
        >
            {children}
        </ErrorBoundary>
    );
}
