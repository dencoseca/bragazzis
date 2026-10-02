/** @vitest-environment happy-dom */

import { act, fireEvent, render, screen } from "@testing-library/react";
import type { HTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { HomeHero } from "@/pages/home/HomeHero";

const { useReducedMotionMock } = vi.hoisted(() => ({
    useReducedMotionMock: vi.fn<() => boolean>(),
}));

interface MotionProps {
    animate?: unknown;
    initial?: unknown;
    transition?: unknown;
    variants?: unknown;
    style?: unknown;
}

function stripMotionProps<T extends MotionProps>({
    animate,
    initial,
    transition,
    variants,
    style,
    ...props
}: T) {
    void initial;
    void transition;
    void variants;
    void style;

    return { ...props, "data-animation-state": String(animate) };
}

vi.mock("motion/react", () => ({
    motion: {
        div(props: HTMLAttributes<HTMLDivElement> & MotionProps) {
            return <div {...stripMotionProps(props)} />;
        },
        span(props: HTMLAttributes<HTMLSpanElement> & MotionProps) {
            return <span {...stripMotionProps(props)} />;
        },
    },
    useReducedMotion: useReducedMotionMock,
}));

vi.mock("@/hooks/useScrollParallax", () => ({
    useScrollParallax() {
        return 0;
    },
}));

vi.mock("@/components/OptimizedImage", () => ({
    OptimizedImage({
        className,
        alt,
        onReady,
        onError,
    }: {
        className?: string;
        alt: string;
        onReady?: () => void;
        onError?: () => void;
    }) {
        return (
            <picture className={className} onError={onError}>
                <img alt={alt} onLoad={onReady} />
            </picture>
        );
    },
}));

vi.mock("@/assets/images/parmesan.jpg?preset=fullWidth", () => ({
    default: {},
}));

function getTitleState() {
    return screen.getByText("Bragazzi’s").dataset.animationState;
}

function getPhotoState() {
    return screen.getByRole("img").closest("picture")?.parentElement?.dataset.animationState;
}

function stubFontLoading() {
    let resolveFont = () => {};
    const fontLoad = new Promise<void>((resolve) => {
        resolveFont = resolve;
    });
    const load = vi.fn(() => fontLoad);

    Object.defineProperty(document, "fonts", { configurable: true, value: { load } });

    return { load, resolveFont };
}

describe("HomeHero", () => {
    beforeEach(() => {
        useReducedMotionMock.mockReturnValue(false);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
        Reflect.deleteProperty(document, "fonts");
    });

    test("renders the wordmark, the shop's details, and the hero photograph", () => {
        render(<HomeHero />);

        expect(screen.getByRole("heading", { level: 1, name: "Bragazzi’s" })).toBeDefined();
        expect(screen.getByText("Purveyors of quality Italian goods")).toBeDefined();
        expect(
            screen.getByRole("link", { name: "224–228 Abbeydale Road, Sheffield" }),
        ).toBeDefined();
        expect(
            screen.getByRole("img", {
                name: "an amaretti tin displayed on wheels of Parmesan cheese",
            }),
        ).toBeDefined();
    });

    test("holds the wordmark until its typeface has loaded", async () => {
        const { load, resolveFont } = stubFontLoading();
        render(<HomeHero />);

        expect(load).toHaveBeenCalledWith('400 1em "Instrument Serif"');
        expect(getTitleState()).toBe("initial");

        await act(async () => resolveFont());

        expect(getTitleState()).toBe("animate");
    });

    test("holds the photograph until it is ready, then releases below-fold images", () => {
        stubFontLoading();
        const onSettled = vi.fn();
        render(<HomeHero onSettled={onSettled} />);

        expect(getPhotoState()).toBe("initial");
        expect(onSettled).not.toHaveBeenCalled();

        fireEvent.load(screen.getByRole("img"));

        expect(getPhotoState()).toBe("animate");
        expect(onSettled).toHaveBeenCalledOnce();
    });

    test("reveals the photograph after a failed load", () => {
        stubFontLoading();
        const onSettled = vi.fn();
        render(<HomeHero onSettled={onSettled} />);

        fireEvent.error(screen.getByRole("img"));

        expect(getPhotoState()).toBe("animate");
        expect(onSettled).toHaveBeenCalledOnce();
    });

    test("starts the intro after bounded waits when the font and image are slow", () => {
        vi.useFakeTimers();
        stubFontLoading();
        const onSettled = vi.fn();
        render(<HomeHero onSettled={onSettled} />);

        act(() => vi.advanceTimersByTime(1_200));

        expect(getTitleState()).toBe("animate");
        expect(getPhotoState()).toBe("initial");

        act(() => vi.advanceTimersByTime(1_300));

        expect(getPhotoState()).toBe("animate");
        expect(onSettled).toHaveBeenCalledOnce();
    });

    test("skips the intro entirely under reduced motion", () => {
        useReducedMotionMock.mockReturnValue(true);
        stubFontLoading();
        render(<HomeHero />);

        expect(getTitleState()).toBe("undefined");
        expect(getPhotoState()).toBe("undefined");
    });
});
