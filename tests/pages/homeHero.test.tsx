/** @vitest-environment happy-dom */

import { act, fireEvent, render, screen } from "@testing-library/react";
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

            return <div {...props} data-animation-state={String(animate)} />;
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

            return <h1 {...props} data-animation-state={String(animate)} />;
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

            return <svg {...props} data-animation-state={String(animate)} />;
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
    OptimizedImage({
        className,
        alt,
        onReady,
    }: {
        className?: string;
        alt: string;
        onReady?: () => void;
    }) {
        return (
            <picture className={className}>
                <img alt={alt} onLoad={onReady} />
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
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    test("holds the intro until the hero image is ready", () => {
        const onSettled = vi.fn();
        render(<HomeHero scrollYProgress={scrollYProgress} onSettled={onSettled} />);

        const title = screen.getByRole("heading", { name: "BRAGAZZI'S" });
        const heroImage = screen.getByRole("img", {
            name: "an amaretti tin displayed on wheels of Parmesan cheese",
        });

        expect(title.dataset.animationState).toBe("initial");
        expect(onSettled).not.toHaveBeenCalled();

        fireEvent.load(heroImage);

        expect(title.dataset.animationState).toBe("animate");
        expect(onSettled).toHaveBeenCalledOnce();
    });

    test("starts the intro after a bounded wait when the image is slow", () => {
        vi.useFakeTimers();
        const onSettled = vi.fn();
        render(<HomeHero scrollYProgress={scrollYProgress} onSettled={onSettled} />);

        const title = screen.getByRole("heading", { name: "BRAGAZZI'S" });

        expect(title.dataset.animationState).toBe("initial");

        act(() => vi.advanceTimersByTime(2_500));

        expect(title.dataset.animationState).toBe("animate");
        expect(onSettled).toHaveBeenCalledOnce();
    });

    test("keeps the scroll cue as non-interactive text and preserves opening hours", () => {
        render(<HomeHero scrollYProgress={scrollYProgress} />);
        expect(screen.getAllByRole("list")).toHaveLength(1);
        expect(
            screen.getByRole("heading", { name: /Roam freely and find inspiration/ }),
        ).toBeDefined();
        const cue = screen.getByText("Il Caffè", {
            selector: ".home-hero__scroll-cue span",
        }).parentElement;
        expect(cue?.tagName).toBe("DIV");
        expect(cue?.hasAttribute("tabindex")).toBe(false);
        expect(screen.queryByRole("button", { name: "Scroll down" })).toBeNull();
    });
});
