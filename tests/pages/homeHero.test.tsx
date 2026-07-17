/** @vitest-environment happy-dom */

import type { MotionValue } from "motion/react";
import type { HTMLAttributes, SVGProps } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { HomeHero } from "@/pages/home/HomeHero";

import { cleanupRenderedTrees, clickElement, renderWithAct } from "../testUtils";

const { useIsMobileMock, useReducedMotionMock } = vi.hoisted(() => ({
    useIsMobileMock: vi.fn<() => boolean>(),
    useReducedMotionMock: vi.fn<() => boolean>(),
}));

interface MotionProps {
    animate?: unknown;
    initial?: unknown;
    transition?: unknown;
    variants?: unknown;
}

vi.mock("motion/react", () => ({
    motion: {
        div({
            animate,
            initial,
            transition,
            variants,
            ...props
        }: HTMLAttributes<HTMLDivElement> & MotionProps) {
            void animate;
            void initial;
            void transition;
            void variants;

            return <div {...props} />;
        },
        h1({
            animate,
            initial,
            transition,
            variants,
            ...props
        }: HTMLAttributes<HTMLHeadingElement> & MotionProps) {
            void animate;
            void initial;
            void transition;
            void variants;

            return <h1 {...props} />;
        },
        svg({
            animate,
            initial,
            transition,
            variants,
            ...props
        }: SVGProps<SVGSVGElement> & MotionProps) {
            void animate;
            void initial;
            void transition;
            void variants;

            return <svg {...props} />;
        },
    },
    useReducedMotion: useReducedMotionMock,
    useTransform() {
        return 0;
    },
}));

vi.mock("@/hooks/useMediaQuery", () => ({
    useIsMobile: useIsMobileMock,
}));

vi.mock("@/components/OptimizedImage", () => ({
    OptimizedImage({ className, alt }: { className?: string; alt: string }) {
        return (
            <picture className={className}>
                <img alt={alt} />
            </picture>
        );
    },
}));

vi.mock("@/assets/images/parmesan.jpg?preset=fullWidth", () => ({
    default: {},
}));

const scrollYProgress = {} as MotionValue<number>;

describe("HomeHero", () => {
    beforeEach(() => {
        useIsMobileMock.mockReturnValue(false);
        useReducedMotionMock.mockReturnValue(false);
    });

    afterEach(async () => {
        vi.clearAllMocks();
        await cleanupRenderedTrees();
    });

    test("owns the desktop statement target and shared opening hours", async () => {
        const container = await renderWithAct(<HomeHero scrollYProgress={scrollYProgress} />);
        const mobileCover = container.querySelector<HTMLElement>("#mobile-cover");
        const statement = container.querySelector<HTMLElement>("#statement");
        const scrollButton = container.querySelector<HTMLButtonElement>(".cover__down-arrow-btn");
        const mobileScrollIntoView = vi.fn();
        const statementScrollIntoView = vi.fn();

        if (!mobileCover || !statement || !scrollButton) {
            throw new Error("Expected the complete Home hero to be rendered");
        }

        mobileCover.scrollIntoView = mobileScrollIntoView;
        statement.scrollIntoView = statementScrollIntoView;

        expect(container.querySelectorAll(".opening-hours")).toHaveLength(2);
        expect(container.textContent).toContain("Roam freely and find inspiration");

        await clickElement(scrollButton);

        expect(statementScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
        expect(mobileScrollIntoView).not.toHaveBeenCalled();
    });

    test("uses the mobile target and reduced-motion scroll behaviour", async () => {
        useIsMobileMock.mockReturnValue(true);
        useReducedMotionMock.mockReturnValue(true);

        const container = await renderWithAct(<HomeHero scrollYProgress={scrollYProgress} />);
        const mobileCover = container.querySelector<HTMLElement>("#mobile-cover");
        const statement = container.querySelector<HTMLElement>("#statement");
        const scrollButton = container.querySelector<HTMLButtonElement>(".cover__down-arrow-btn");
        const mobileScrollIntoView = vi.fn();
        const statementScrollIntoView = vi.fn();

        if (!mobileCover || !statement || !scrollButton) {
            throw new Error("Expected the complete Home hero to be rendered");
        }

        mobileCover.scrollIntoView = mobileScrollIntoView;
        statement.scrollIntoView = statementScrollIntoView;

        await clickElement(scrollButton);

        expect(mobileScrollIntoView).toHaveBeenCalledWith({ behavior: "auto" });
        expect(statementScrollIntoView).not.toHaveBeenCalled();
    });
});
