import { Link } from "react-router-dom";

import { PageMeta } from "@/components/PageMeta";
import { siteConfig } from "@/constants/siteConfig";

const PAGE_TITLE = "404 — Page Not Found";
const PAGE_DESCRIPTION = "Page not found.";

export function NotFound() {
    return (
        <div className="page-not-found">
            <PageMeta pageTitle={PAGE_TITLE} description={PAGE_DESCRIPTION} robots="noindex" />
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
