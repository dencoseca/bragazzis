import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { LoadingFallback } from "@/components/LoadingFallback";

const Home = lazy(() => import("@/pages/Home").then((m) => ({ default: m.Home })));
const LaStoria = lazy(() => import("@/pages/LaStoria").then((m) => ({ default: m.LaStoria })));
const IlGiorno = lazy(() => import("@/pages/IlGiorno").then((m) => ({ default: m.IlGiorno })));
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));

export function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lastoria" element={<LaStoria />} />
                <Route path="/ilgiorno" element={<IlGiorno />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
