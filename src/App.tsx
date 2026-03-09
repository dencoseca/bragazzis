import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import LoadingFallback from "@/components/LoadingFallback";

const Home = lazy(() => import("@/pages/Home"));
const LaStoria = lazy(() => import("@/pages/LaStoria"));
const IlGiorno = lazy(() => import("@/pages/IlGiorno"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
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

export default App;
