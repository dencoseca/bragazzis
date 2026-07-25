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
                noIndex
            />
            <Link to={publicPageRoutes.home.path} className="page-not-found__logo">
                {siteConfig.business.name}
            </Link>
            <div className="page-not-found__content">
                <h1>404</h1>
                <p className="page-not-found__headline">There's no more bread.</p>
                <p className="page-not-found__message">
                    D'you do soup? Nope... no, we don't do soup.
                </p>
            </div>
            <Link to={publicPageRoutes.home.path} className="page-not-found__back-button">
                I'll come back
            </Link>
        </div>
    );
}
