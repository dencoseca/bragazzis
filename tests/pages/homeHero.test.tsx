/** @vitest-environment happy-dom */

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { MotionValue } from "motion/react";
import type { HTMLAttributes, SVGProps } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { siteConfig } from "@/constants/siteConfig";
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

vi.mock("@/assets/images/coffee-display.jpg?preset=fullWidth", () => ({
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

    test("settles once when the hero loads before the timeout", () => {
        vi.useFakeTimers();
        const onSettled = vi.fn();
        render(<HomeHero scrollYProgress={scrollYProgress} onSettled={onSettled} />);

        const title = screen.getByRole("heading", { name: "BRAGAZZI'S" });
        const heroImage = screen.getByRole("img", {
            name: "Bragazzi’s coffee bags displayed beside Italian coffee makers",
        });

        expect(title.dataset.animationState).toBe("initial");
        expect(onSettled).not.toHaveBeenCalled();

        fireEvent.load(heroImage);

        expect(title.dataset.animationState).toBe("animate");
        expect(onSettled).toHaveBeenCalledOnce();
        act(() => vi.advanceTimersByTime(2_500));
        expect(onSettled).toHaveBeenCalledOnce();
    });

    test("starts the intro after a bounded wait when the image is slow", () => {
        vi.useFakeTimers();
        const onSettled = vi.fn();
        render(<HomeHero scrollYProgress={scrollYProgress} onSettled={onSettled} />);

        const title = screen.getByRole("heading", { name: "BRAGAZZI'S" });

        expect(title.dataset.animationState).toBe("initial");

        act(() => vi.advanceTimersByTime(2_499));
        expect(title.dataset.animationState).toBe("initial");
        expect(onSettled).not.toHaveBeenCalled();
        act(() => vi.advanceTimersByTime(1));

        expect(title.dataset.animationState).toBe("animate");
        expect(onSettled).toHaveBeenCalledOnce();
        fireEvent.load(screen.getByRole("img"));
        expect(onSettled).toHaveBeenCalledOnce();
    });

    test("renders the configured opening hours", () => {
        render(<HomeHero scrollYProgress={scrollYProgress} />);
        const hours = screen.getByRole("region", { name: "Opening hours" });
        expect(
            within(hours)
                .getAllByRole("listitem")
                .map((item) => item.textContent),
        ).toEqual(siteConfig.openingHours.display);
    });
});
