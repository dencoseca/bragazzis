/** @vitest-environment happy-dom */

import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vite-plus/test";

import { Footer } from "@/components/layout/Footer";
import { themeNames } from "@/constants/themes";
import { HomeHero } from "@/pages/home/HomeHero";

vi.mock("@/assets/images/parmesan.jpg?preset=fullWidth", () => ({ default: {} }));
vi.mock("@/components/OptimizedImage", () => ({ OptimizedImage: () => null }));
vi.mock("@/hooks/useScrollParallax", () => ({ useScrollParallax: () => 0 }));

test.each([
    { placement: "home heading", component: <HomeHero />, selector: "h1" },
    { placement: "footer", component: <Footer theme={themeNames.light} />, selector: "footer" },
])(
    "fits the complete name inside the $placement regardless of font metrics",
    ({ component, selector }) => {
        const container = document.createElement("div");
        container.innerHTML = renderToStaticMarkup(component);
        const text = container.querySelector(`${selector} svg text`);
        expect(text?.textContent).toBe("Bragazzi’s");
        expect(text?.getAttribute("lengthAdjust")).toBe("spacingAndGlyphs");

        const svg = text!.closest("svg")!;
        expect(svg.getAttribute("width")).toBe("100%");
        const [left, , width] = svg.getAttribute("viewBox")!.split(/\s+/).map(Number);
        const start = Number(text!.getAttribute("x"));
        const length = Number(text!.getAttribute("textLength"));
        expect(length).toBeGreaterThan(0);
        expect(start).toBeGreaterThanOrEqual(left);
        expect(start + length).toBeLessThanOrEqual(left + width);
    },
);
