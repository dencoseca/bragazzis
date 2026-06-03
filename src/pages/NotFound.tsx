import { Link } from "react-router-dom";

import { PageMeta } from "@/components/PageMeta";
import { notFoundRoute, publicPageRoutes } from "@/constants/routes";
import { siteConfig } from "@/constants/siteConfig";

export function NotFound() {
    return (
        <div className="page-not-found">
            <PageMeta
                pageTitle={notFoundRoute.pageTitle}
                description={notFoundRoute.description}
                robots="noindex"
            />
            <Link to={publicPageRoutes.home.path} className="logo">
                {siteConfig.business.name}
            </Link>
            <h1>404</h1>
            <p>Page not found</p>
            <Link to={publicPageRoutes.home.path} className="back-button">
                ← Back to Home
            </Link>
        </div>
    );
}
