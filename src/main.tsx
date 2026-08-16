import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "lenis/dist/lenis.css";
import "@/styles/main.scss";
import { App } from "@/App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <MotionConfig reducedMotion="user">
                <App />
            </MotionConfig>
        </BrowserRouter>
    </StrictMode>,
);
