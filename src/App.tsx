import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { LoadingFallback } from "@/components/LoadingFallback";
import { notFoundRoute, publicPageRoutes } from "@/constants/routes";

const Home = lazy(() => import("@/pages/home/Home").then((m) => ({ default: m.Home })));
const LaStoria = lazy(() => import("@/pages/LaStoria").then((m) => ({ default: m.LaStoria })));
const IlGiorno = lazy(() => import("@/pages/IlGiorno").then((m) => ({ default: m.IlGiorno })));
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));

export function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path={publicPageRoutes.home.path} element={<Home />} />
                <Route path={publicPageRoutes.laStoria.path} element={<LaStoria />} />
                <Route path={publicPageRoutes.ilGiorno.path} element={<IlGiorno />} />
                <Route path={notFoundRoute.path} element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
