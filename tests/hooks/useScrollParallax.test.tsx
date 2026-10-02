/** @vitest-environment happy-dom */

import { renderHook } from "@testing-library/react";
import type { MotionValue, UseScrollOptions } from "motion/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { useScrollParallax } from "@/hooks/useScrollParallax";

type UseTransformMock = (
    value: MotionValue<number>,
    input: [number, number],
    output: [string, string],
) => MotionValue<string>;

const scrollYProgress = {} as MotionValue<number>;

const { useIsMobileMock, useIsTabletMock, useReducedMotionMock, useScrollMock, useTransformMock } =
    vi.hoisted(() => ({
        useIsMobileMock: vi.fn<() => boolean>(),
        useIsTabletMock: vi.fn<() => boolean>(),
        useReducedMotionMock: vi.fn<() => boolean>(),
        useScrollMock: vi.fn<(options: UseScrollOptions) => { scrollYProgress: unknown }>(),
        useTransformMock: vi.fn<UseTransformMock>(),
    }));

vi.mock("motion/react", () => ({
    useReducedMotion: useReducedMotionMock,
    useScroll: useScrollMock,
    useTransform: useTransformMock,
}));

vi.mock("@/hooks/useMediaQuery", () => ({
    useIsMobile: useIsMobileMock,
    useIsTablet: useIsTabletMock,
}));

const target = { current: null };
const output: [string, string] = ["0vh", "10vh"];
const tabletOutput: [string, string] = ["0vh", "5vh"];

describe("useScrollParallax", () => {
    beforeEach(() => {
        useIsMobileMock.mockReturnValue(false);
        useIsTabletMock.mockReturnValue(false);
        useReducedMotionMock.mockReturnValue(false);
        useScrollMock.mockReturnValue({ scrollYProgress });
        useTransformMock.mockImplementation(
            (_value, _input, selectedOutput) => selectedOutput as unknown as MotionValue<string>,
        );
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("tracks the target through the viewport by default", () => {
        const { result } = renderHook(() => useScrollParallax(target, { output, tabletOutput }));

        expect(useScrollMock).toHaveBeenCalledWith({
            target,
            offset: ["start end", "end start"],
        });
        expect(useTransformMock).toHaveBeenCalledOnce();
        expect(useTransformMock).toHaveBeenCalledWith(scrollYProgress, [0, 1], output);
        expect(result.current).toBe(output);
    });

    test("passes a custom scroll offset through to Motion", () => {
        renderHook(() =>
            useScrollParallax(target, { offset: ["start start", "end end"], output: [0, 1] }),
        );

        expect(useScrollMock).toHaveBeenCalledWith({
            target,
            offset: ["start start", "end end"],
        });
    });

    test("updates the transform output when crossing the tablet breakpoint", () => {
        let isTablet = false;
        useIsTabletMock.mockImplementation(() => isTablet);
        const { rerender, result } = renderHook(() =>
            useScrollParallax(target, { output, tabletOutput }),
        );

        expect(result.current).toBe(output);

        isTablet = true;
        rerender();

        expect(useTransformMock).toHaveBeenCalledTimes(2);
        expect(useTransformMock).toHaveBeenLastCalledWith(scrollYProgress, [0, 1], tabletOutput);
        expect(result.current).toBe(tabletOutput);
    });

    test("falls back to the desktop output on tablet when no tablet output is provided", () => {
        useIsTabletMock.mockReturnValue(true);

        const { result } = renderHook(() => useScrollParallax(target, { output }));

        expect(useTransformMock).toHaveBeenCalledWith(scrollYProgress, [0, 1], output);
        expect(result.current).toBe(output);
    });

    test.each([
        { isMobile: true, prefersReducedMotion: false },
        { isMobile: false, prefersReducedMotion: true },
    ])(
        "returns zero while still creating one transform when parallax is disabled",
        ({ isMobile, prefersReducedMotion }) => {
            useIsMobileMock.mockReturnValue(isMobile);
            useReducedMotionMock.mockReturnValue(prefersReducedMotion);

            const { result } = renderHook(() =>
                useScrollParallax(target, { output, tabletOutput }),
            );

            expect(useTransformMock).toHaveBeenCalledOnce();
            expect(result.current).toBe(0);
        },
    );
});
