import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { siteConfig } from "@/constants/siteConfig";

const PAGE_TITLE = "404 — Page Not Found";
const PAGE_DESCRIPTION = "Page not found.";

export function NotFound() {
    const fullTitle = `${PAGE_TITLE} | ${siteConfig.business.name}`;

    return (
        <div className="page-not-found">
            <Helmet>
                <title>{fullTitle}</title>
                <meta name="description" content={PAGE_DESCRIPTION} />
                <meta name="robots" content="noindex" />
            </Helmet>
            <Link to="/" className="logo">
                {siteConfig.business.name}
            </Link>
            <h1>404</h1>
            <p>Page not found</p>
            <Link to="/" className="back-button">
                ← Back to Home
            </Link>
        </div>
    );
}
