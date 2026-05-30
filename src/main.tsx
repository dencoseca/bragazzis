import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import "@/styles/main.scss";
import { App } from "@/App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <MotionConfig reducedMotion="user">
                    <App />
                </MotionConfig>
            </BrowserRouter>
        </HelmetProvider>
    </StrictMode>,
);
