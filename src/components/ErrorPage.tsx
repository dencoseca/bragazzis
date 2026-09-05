import type { ReactNode, Ref } from "react";
import { Link } from "react-router-dom";

import { publicPageRoutes } from "@/constants/routes";
import { siteConfig } from "@/constants/siteConfig";

interface ErrorPageProps {
    title: string;
    variant?: "recovery";
    headline: string;
    message: string;
    action: ReactNode;
    children?: ReactNode;
    ref?: Ref<HTMLElement>;
}

export function ErrorPage({
    title,
    variant,
    headline,
    message,
    action,
    children,
    ref,
}: ErrorPageProps) {
    return (
        <main
            id="main-content"
            tabIndex={-1}
            className={variant ? `error-page error-page--${variant}` : "error-page"}
            ref={ref}
        >
            {children}
            <Link to={publicPageRoutes.home.path} className="error-page__logo">
                {siteConfig.business.name}
            </Link>
            <div className="error-page__content">
                <h1>{title}</h1>
                <p className="error-page__headline">{headline}</p>
                <p className="error-page__message">{message}</p>
            </div>
            {action}
        </main>
    );
}
