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
            <div className="page-not-found__content">
                <h1>404</h1>
                <p className="page-not-found__headline">This table's empty.</p>
                <p className="page-not-found__message">
                    Looks like this page nipped out for an espresso before the tiramisu arrived.
                </p>
            </div>
            <Link to={publicPageRoutes.home.path} className="back-button">
                Take me home
            </Link>
        </div>
    );
}
