/** @vitest-environment happy-dom */

import { render } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

const lenisMocks = vi.hoisted(() => ({
    instances: [] as Array<{ destroy: ReturnType<typeof vi.fn> }>,
    construct: vi.fn(),
}));

vi.mock("lenis", () => ({
    default: class Lenis {
        readonly destroy = vi.fn();
        constructor(options: unknown) {
            lenisMocks.construct(options);
            lenisMocks.instances.push(this);
        }
    },
}));

function SmoothScrollHarness({
    enabled,
    navigationKey,
}: {
    enabled?: boolean;
    navigationKey?: string;
}) {
    useSmoothScroll(enabled, navigationKey);

    return null;
}

describe("useSmoothScroll", () => {
    afterEach(() => {
        vi.clearAllMocks();
        lenisMocks.instances.length = 0;
    });

    test("creates and destroys a local Lenis instance", () => {
        const { unmount } = render(<SmoothScrollHarness />);

        expect(lenisMocks.construct).toHaveBeenCalledOnce();
        expect(lenisMocks.construct).toHaveBeenCalledWith({ autoRaf: true });
        expect(lenisMocks.instances[0].destroy).not.toHaveBeenCalled();

        unmount();

        expect(lenisMocks.instances[0].destroy).toHaveBeenCalledOnce();
    });

    test("replaces the Lenis instance when the history entry changes", () => {
        const { rerender, unmount } = render(<SmoothScrollHarness navigationKey="first" />);
        rerender(<SmoothScrollHarness navigationKey="second" />);
        expect(lenisMocks.instances[0].destroy).toHaveBeenCalledOnce();
        expect(lenisMocks.construct).toHaveBeenCalledTimes(2);
        expect(lenisMocks.instances[0].destroy.mock.invocationCallOrder[0]).toBeLessThan(
            lenisMocks.construct.mock.invocationCallOrder[1],
        );
        expect(lenisMocks.instances[1].destroy).not.toHaveBeenCalled();
        unmount();
        expect(lenisMocks.instances[0].destroy).toHaveBeenCalledOnce();
        expect(lenisMocks.instances[1].destroy).toHaveBeenCalledOnce();
    });

    test("does not create Lenis when smooth scrolling is disabled", () => {
        const { unmount } = render(<SmoothScrollHarness enabled={false} />);

        expect(lenisMocks.construct).not.toHaveBeenCalled();

        unmount();

        expect(lenisMocks.instances).toHaveLength(0);
    });

    test("destroys and recreates Lenis when smooth scrolling is toggled", () => {
        const { rerender, unmount } = render(<SmoothScrollHarness />);

        rerender(<SmoothScrollHarness enabled={false} />);

        expect(lenisMocks.construct).toHaveBeenCalledOnce();
        expect(lenisMocks.instances[0].destroy).toHaveBeenCalledOnce();
        rerender(<SmoothScrollHarness enabled />);
        expect(lenisMocks.instances).toHaveLength(2);
        expect(lenisMocks.instances[1].destroy).not.toHaveBeenCalled();
        unmount();
        expect(lenisMocks.instances[1].destroy).toHaveBeenCalledOnce();

        expect(lenisMocks.instances[0].destroy).toHaveBeenCalledOnce();
    });

    test("cleans up each Lenis instance under Strict Mode", () => {
        const { unmount } = render(
            <StrictMode>
                <SmoothScrollHarness />
            </StrictMode>,
        );

        expect(lenisMocks.construct).toHaveBeenCalledTimes(2);
        expect(lenisMocks.instances[0].destroy).toHaveBeenCalledOnce();

        unmount();

        for (const instance of lenisMocks.instances) {
            expect(instance.destroy).toHaveBeenCalledOnce();
        }
    });
});
