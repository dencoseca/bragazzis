import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@/styles/main.scss";
import { App } from "@/App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <MotionConfig reducedMotion="user">
                {/* Keep features synchronous so entrances never wait for another download. */}
                <LazyMotion features={domAnimation} strict>
                    <App />
                </LazyMotion>
            </MotionConfig>
        </BrowserRouter>
    </StrictMode>,
);
