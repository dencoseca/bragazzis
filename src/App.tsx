import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import LaStoria from "@/pages/LaStoria";
import IlGiorno from "@/pages/IlGiorno";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lastoria" element={<LaStoria />} />
            <Route path="/ilgiorno" element={<IlGiorno />} />
        </Routes>
    );
}

export default App;
