/** @vitest-environment happy-dom */

import { act, StrictMode } from "react";
import { createRoot } from "react-dom/client";
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

    test("creates and destroys a local Lenis instance", async () => {
        const container = document.createElement("div");
        const root = createRoot(container);

        await act(async () => {
            root.render(<SmoothScrollHarness />);
        });

        expect(lenisMocks.construct).toHaveBeenCalledOnce();
        expect(lenisMocks.construct).toHaveBeenCalledWith({ autoRaf: true });
        expect(lenisMocks.destroy).not.toHaveBeenCalled();

        await act(async () => {
            root.unmount();
        });

        expect(lenisMocks.destroy).toHaveBeenCalledOnce();
    });

    test("does not create Lenis when smooth scrolling is disabled", async () => {
        const container = document.createElement("div");
        const root = createRoot(container);

        await act(async () => {
            root.render(<SmoothScrollHarness enabled={false} />);
        });

        expect(lenisMocks.construct).not.toHaveBeenCalled();

        await act(async () => {
            root.unmount();
        });

        expect(lenisMocks.destroy).not.toHaveBeenCalled();
    });

    test("destroys Lenis when smooth scrolling becomes disabled", async () => {
        const container = document.createElement("div");
        const root = createRoot(container);

        await act(async () => {
            root.render(<SmoothScrollHarness />);
        });

        await act(async () => {
            root.render(<SmoothScrollHarness enabled={false} />);
        });

        expect(lenisMocks.construct).toHaveBeenCalledOnce();
        expect(lenisMocks.destroy).toHaveBeenCalledOnce();

        await act(async () => {
            root.unmount();
        });

        expect(lenisMocks.destroy).toHaveBeenCalledOnce();
    });

    test("cleans up each Lenis instance under Strict Mode", async () => {
        const container = document.createElement("div");
        const root = createRoot(container);

        await act(async () => {
            root.render(
                <StrictMode>
                    <SmoothScrollHarness />
                </StrictMode>,
            );
        });

        expect(lenisMocks.construct).toHaveBeenCalledTimes(2);
        expect(lenisMocks.destroy).toHaveBeenCalledOnce();

        await act(async () => {
            root.unmount();
        });

        expect(lenisMocks.destroy).toHaveBeenCalledTimes(2);
    });
});
