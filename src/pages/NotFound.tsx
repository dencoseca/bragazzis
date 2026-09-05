import { Link } from "react-router-dom";

import { ErrorPage } from "@/components/ErrorPage";
import { PageMeta } from "@/components/PageMeta";
import { notFoundRoute, publicPageRoutes } from "@/constants/routes";

export function NotFound() {
    return (
        <ErrorPage
            title="404"
            headline="There's no more bread."
            message="D'you do soup? Nope... no, we don't do soup."
            action={
                <Link to={publicPageRoutes.home.path} className="error-page__action">
                    I'll come back
                </Link>
            }
        >
            <PageMeta
                pageTitle={notFoundRoute.pageTitle}
                description={notFoundRoute.description}
                noIndex
            />
        </ErrorPage>
    );
}
