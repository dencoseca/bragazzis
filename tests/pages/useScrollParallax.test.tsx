/** @vitest-environment happy-dom */

import { renderHook } from "@testing-library/react";
import type { MotionValue } from "motion/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { useScrollParallax } from "@/pages/home/useScrollParallax";

type UseTransformMock = (
    value: MotionValue<number>,
    input: [number, number],
    output: [string, string],
) => MotionValue<string>;

const { useIsMobileMock, useIsTabletMock, useReducedMotionMock, useTransformMock } = vi.hoisted(
    () => ({
        useIsMobileMock: vi.fn<() => boolean>(),
        useIsTabletMock: vi.fn<() => boolean>(),
        useReducedMotionMock: vi.fn<() => boolean>(),
        useTransformMock: vi.fn<UseTransformMock>(),
    }),
);

vi.mock("motion/react", () => ({
    useReducedMotion: useReducedMotionMock,
    useTransform: useTransformMock,
}));

vi.mock("@/hooks/useMediaQuery", () => ({
    useIsMobile: useIsMobileMock,
    useIsTablet: useIsTabletMock,
}));

const scrollYProgress = {} as MotionValue<number>;
const input: [number, number] = [0, 1];
const output: [string, string] = ["0vh", "10vh"];
const tabletOutput: [string, string] = ["0vh", "5vh"];

describe("useScrollParallax", () => {
    beforeEach(() => {
        useIsMobileMock.mockReturnValue(false);
        useIsTabletMock.mockReturnValue(false);
        useReducedMotionMock.mockReturnValue(false);
        useTransformMock.mockImplementation(
            (_value, _input, selectedOutput) => selectedOutput as unknown as MotionValue<string>,
        );
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("uses the desktop output", () => {
        const { result } = renderHook(() =>
            useScrollParallax(scrollYProgress, { input, output, tabletOutput }),
        );

        expect(useTransformMock).toHaveBeenCalledWith(scrollYProgress, input, output);
        expect(result.current).toBe(output);
    });

    test("updates the transform output when crossing the tablet breakpoint", () => {
        let isTablet = false;
        useIsTabletMock.mockImplementation(() => isTablet);
        const { rerender, result } = renderHook(() =>
            useScrollParallax(scrollYProgress, { input, output, tabletOutput }),
        );

        expect(result.current).toBe(output);

        isTablet = true;
        rerender();

        expect(useTransformMock).toHaveBeenLastCalledWith(scrollYProgress, input, tabletOutput);
        expect(result.current).toBe(tabletOutput);
    });

    test("falls back to the desktop output on tablet when no tablet output is provided", () => {
        useIsTabletMock.mockReturnValue(true);

        const { result } = renderHook(() => useScrollParallax(scrollYProgress, { input, output }));

        expect(useTransformMock).toHaveBeenCalledWith(scrollYProgress, input, output);
        expect(result.current).toBe(output);
    });

    test.each([
        { isMobile: true, prefersReducedMotion: false },
        { isMobile: false, prefersReducedMotion: true },
    ])("returns zero when parallax is disabled", ({ isMobile, prefersReducedMotion }) => {
        useIsMobileMock.mockReturnValue(isMobile);
        useReducedMotionMock.mockReturnValue(prefersReducedMotion);

        const { result } = renderHook(() =>
            useScrollParallax(scrollYProgress, { input, output, tabletOutput }),
        );

        expect(result.current).toBe(0);
    });
});
