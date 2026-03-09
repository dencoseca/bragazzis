import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import LaStoria from "@/pages/LaStoria";
import IlGiorno from "@/pages/IlGiorno";
import NotFound from "@/pages/NotFound";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lastoria" element={<LaStoria />} />
            <Route path="/ilgiorno" element={<IlGiorno />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
