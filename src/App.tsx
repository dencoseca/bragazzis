import { lazy, Suspense, type ComponentType } from "react";
import { Routes, Route } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import { LoadingFallback } from "@/components/LoadingFallback";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { RouteNavigation } from "@/components/RouteNavigation";
import { notFoundRoute, publicPageRoutes, type PublicPageRoute } from "@/constants/routes";
import { themeNames, type ThemeName } from "@/constants/themes";
import { Home } from "@/pages/home/Home";

const LaStoria = lazy(() => import("@/pages/LaStoria").then((m) => ({ default: m.LaStoria })));
const IlGiorno = lazy(() =>
    import("@/pages/il-giorno/IlGiorno").then((m) => ({ default: m.IlGiorno })),
);
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));

interface PageRouteConfig {
    route: PublicPageRoute;
    Page: ComponentType;
    theme: ThemeName;
    scrollToTopBehavior?: ScrollBehavior;
}

const pageRoutes: PageRouteConfig[] = [
    {
        route: publicPageRoutes.home,
        Page: Home,
        theme: themeNames.light,
    },
    {
        route: publicPageRoutes.laStoria,
        Page: LaStoria,
        theme: themeNames.light,
    },
    {
        route: publicPageRoutes.ilGiorno,
        Page: IlGiorno,
        theme: themeNames.dark,
        scrollToTopBehavior: "auto",
    },
];

export function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <RouteNavigation />
            <RouteErrorBoundary>
                <Routes>
                    {pageRoutes.map(({ route, Page, theme, scrollToTopBehavior }) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={
                                <Layout
                                    pageTitle={route.pageTitle}
                                    description={route.description}
                                    theme={theme}
                                    scrollToTopBehavior={scrollToTopBehavior}
                                >
                                    <Page />
                                </Layout>
                            }
                        />
                    ))}
                    <Route path={notFoundRoute.path} element={<NotFound />} />
                </Routes>
            </RouteErrorBoundary>
        </Suspense>
    );
}
