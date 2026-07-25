/** @vitest-environment happy-dom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MotionValue } from "motion/react";
import type { HTMLAttributes, SVGProps } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { HomeHero } from "@/pages/home/HomeHero";

const { useIsMobileMock, useIsTabletMock, useReducedMotionMock } = vi.hoisted(() => ({
    useIsMobileMock: vi.fn<() => boolean>(),
    useIsTabletMock: vi.fn<() => boolean>(),
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
    useIsTablet: useIsTabletMock,
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
        useIsTabletMock.mockReturnValue(false);
        useReducedMotionMock.mockReturnValue(false);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("owns the desktop statement target and shared opening hours", async () => {
        const user = userEvent.setup();
        render(<HomeHero scrollYProgress={scrollYProgress} />);
        const mobileCover = document.querySelector<HTMLElement>("#mobile-cover");
        const statement = document.querySelector<HTMLElement>("#statement");
        const mobileScrollIntoView = vi.fn();
        const statementScrollIntoView = vi.fn();

        if (!mobileCover || !statement) {
            throw new Error("Expected the complete Home hero to be rendered");
        }

        mobileCover.scrollIntoView = mobileScrollIntoView;
        statement.scrollIntoView = statementScrollIntoView;

        expect(screen.getAllByRole("list")).toHaveLength(2);
        expect(screen.getByText("Roam freely and find inspiration...")).toBeDefined();

        await user.click(screen.getByRole("button", { name: "Scroll down" }));

        expect(statementScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
        expect(mobileScrollIntoView).not.toHaveBeenCalled();
    });

    test("uses the mobile target and reduced-motion scroll behaviour", async () => {
        const user = userEvent.setup();
        useIsMobileMock.mockReturnValue(true);
        useReducedMotionMock.mockReturnValue(true);

        render(<HomeHero scrollYProgress={scrollYProgress} />);
        const mobileCover = document.querySelector<HTMLElement>("#mobile-cover");
        const statement = document.querySelector<HTMLElement>("#statement");
        const mobileScrollIntoView = vi.fn();
        const statementScrollIntoView = vi.fn();

        if (!mobileCover || !statement) {
            throw new Error("Expected the complete Home hero to be rendered");
        }

        mobileCover.scrollIntoView = mobileScrollIntoView;
        statement.scrollIntoView = statementScrollIntoView;

        await user.click(screen.getByRole("button", { name: "Scroll down" }));

        expect(mobileScrollIntoView).toHaveBeenCalledWith({ behavior: "auto" });
        expect(statementScrollIntoView).not.toHaveBeenCalled();
    });
});
