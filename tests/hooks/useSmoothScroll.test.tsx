/** @vitest-environment happy-dom */

import { render } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const lenisMocks = vi.hoisted(() => ({
    construct: vi.fn(),
    destroy: vi.fn(),
}));

vi.mock("lenis", () => ({
    default: class Lenis {
        constructor(options: unknown) {
            lenisMocks.construct(options);
        }

        destroy() {
            lenisMocks.destroy();
        }
    },
}));

function SmoothScrollHarness({ enabled }: { enabled?: boolean }) {
    useSmoothScroll(enabled);

    return null;
}

describe("useSmoothScroll", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    test("creates and destroys a local Lenis instance", () => {
        const { unmount } = render(<SmoothScrollHarness />);

        expect(lenisMocks.construct).toHaveBeenCalledOnce();
        expect(lenisMocks.construct).toHaveBeenCalledWith({ autoRaf: true });
        expect(lenisMocks.destroy).not.toHaveBeenCalled();

        unmount();

        expect(lenisMocks.destroy).toHaveBeenCalledOnce();
    });

    test("does not create Lenis when smooth scrolling is disabled", () => {
        const { unmount } = render(<SmoothScrollHarness enabled={false} />);

        expect(lenisMocks.construct).not.toHaveBeenCalled();

        unmount();

        expect(lenisMocks.destroy).not.toHaveBeenCalled();
    });

    test("destroys Lenis when smooth scrolling becomes disabled", () => {
        const { rerender, unmount } = render(<SmoothScrollHarness />);

        rerender(<SmoothScrollHarness enabled={false} />);

        expect(lenisMocks.construct).toHaveBeenCalledOnce();
        expect(lenisMocks.destroy).toHaveBeenCalledOnce();

        unmount();

        expect(lenisMocks.destroy).toHaveBeenCalledOnce();
    });

    test("cleans up each Lenis instance under Strict Mode", () => {
        const { unmount } = render(
            <StrictMode>
                <SmoothScrollHarness />
            </StrictMode>,
        );

        expect(lenisMocks.construct).toHaveBeenCalledTimes(2);
        expect(lenisMocks.destroy).toHaveBeenCalledOnce();

        unmount();

        expect(lenisMocks.destroy).toHaveBeenCalledTimes(2);
    });
});
