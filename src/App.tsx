import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import { LoadingFallback } from "@/components/LoadingFallback";
import { RouteNavigation } from "@/components/RouteNavigation";
import { notFoundRoute, publicPageRoutes } from "@/constants/routes";
import { themeNames } from "@/constants/themes";
import { Home } from "@/pages/home/Home";

const LaStoria = lazy(() => import("@/pages/LaStoria").then((m) => ({ default: m.LaStoria })));
const IlGiorno = lazy(() =>
    import("@/pages/il-giorno/IlGiorno").then((m) => ({ default: m.IlGiorno })),
);
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));

export function App() {
    return (
        <>
            <RouteNavigation />
            <Routes>
                <Route
                    path={publicPageRoutes.home.path}
                    element={
                        <Layout
                            pageTitle={publicPageRoutes.home.pageTitle}
                            description={publicPageRoutes.home.description}
                            theme={themeNames.light}
                            headerTheme={themeNames.dark}
                        >
                            <Home />
                        </Layout>
                    }
                />
                <Route
                    path={publicPageRoutes.laStoria.path}
                    element={
                        <Layout
                            pageTitle={publicPageRoutes.laStoria.pageTitle}
                            description={publicPageRoutes.laStoria.description}
                            theme={themeNames.light}
                        >
                            <Suspense fallback={<LoadingFallback />}>
                                <LaStoria />
                            </Suspense>
                        </Layout>
                    }
                />
                <Route
                    path={publicPageRoutes.ilGiorno.path}
                    element={
                        <Layout
                            pageTitle={publicPageRoutes.ilGiorno.pageTitle}
                            description={publicPageRoutes.ilGiorno.description}
                            theme={themeNames.dark}
                            scrollToTopBehavior="auto"
                        >
                            <Suspense fallback={<LoadingFallback />}>
                                <IlGiorno />
                            </Suspense>
                        </Layout>
                    }
                />
                <Route
                    path={notFoundRoute.path}
                    element={
                        <Suspense fallback={<LoadingFallback />}>
                            <NotFound />
                        </Suspense>
                    }
                />
            </Routes>
        </>
    );
}
