import { useEffect, useRef, type ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation } from "react-router-dom";

import { ErrorPage } from "@/components/ErrorPage";
import { PageMeta } from "@/components/PageMeta";

function RouteErrorMessage() {
    const mainRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            mainRef.current?.focus({ preventScroll: true });
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <ErrorPage
            ref={mainRef}
            title="Oops"
            variant="recovery"
            headline="We couldn’t load this page."
            message="Please check your connection and reload to try again."
            action={
                <button
                    className="error-page__action"
                    type="button"
                    onClick={() => window.location.reload()}
                >
                    Reload page
                </button>
            }
        >
            <PageMeta
                pageTitle="Unable to load page"
                description="Please reload to try again."
                noIndex
            />
        </ErrorPage>
    );
}

export function RouteErrorBoundary({ children }: { children: ReactNode }) {
    const { pathname } = useLocation();
    return (
        <ErrorBoundary key={pathname} fallback={<RouteErrorMessage />}>
            {children}
        </ErrorBoundary>
    );
}
