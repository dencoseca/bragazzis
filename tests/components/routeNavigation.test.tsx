/** @vitest-environment happy-dom */

import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, useNavigate, type NavigateFunction } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { RouteNavigation } from "@/components/RouteNavigation";

describe("RouteNavigation", () => {
    afterEach(() => vi.restoreAllMocks());

    function setup(initialEntries = ["/"]) {
        let navigate: NavigateFunction;
        const frames: FrameRequestCallback[] = [];
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
        const scrollIntoView = vi
            .spyOn(HTMLElement.prototype, "scrollIntoView")
            .mockImplementation(() => {});
        vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
            frames.push(callback);
            return frames.length;
        });
        vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});

        function Harness() {
            navigate = useNavigate();
            return (
                <>
                    <RouteNavigation />
                    <main id="main-content" tabIndex={-1}>
                        <h1 id="visit">Visit</h1>
                    </main>
                </>
            );
        }

        render(
            <MemoryRouter initialEntries={initialEntries} initialIndex={initialEntries.length - 1}>
                <Harness />
            </MemoryRouter>,
        );

        return {
            scrollTo,
            scrollIntoView,
            navigate: (to: string | number) => {
                act(() => {
                    if (typeof to === "number") void navigate(to);
                    else void navigate(to);
                });
            },
            flushFrame: () => act(() => frames.splice(0).forEach((callback) => callback(0))),
        };
    }

    test("resets pushed navigation before the focus frame runs", () => {
        const { navigate, scrollTo, flushFrame } = setup();
        expect(scrollTo).not.toHaveBeenCalled();

        navigate("/lastoria");

        expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 0, top: 0, behavior: "instant" });
        flushFrame();
        expect(document.activeElement).toBe(document.querySelector("main"));
        expect(scrollTo).toHaveBeenCalledTimes(1);
    });

    test("scrolls to decoded fragments before paint and focuses them after the menu unlocks", () => {
        const { navigate, scrollTo, scrollIntoView, flushFrame } = setup();

        navigate("/lastoria#%76isit");

        expect(scrollTo).not.toHaveBeenCalled();
        expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({ behavior: "instant" });
        expect(scrollIntoView.mock.instances[0]).toBe(screen.getByRole("heading"));
        flushFrame();
        expect(document.activeElement).toBe(screen.getByRole("heading"));
    });

    test("leaves Back/Forward scrolling to the browser, including fragments", () => {
        const { navigate, scrollTo, scrollIntoView } = setup(["/lastoria#visit", "/ilgiorno"]);

        navigate(-1);

        expect(scrollTo).not.toHaveBeenCalled();
        expect(scrollIntoView).not.toHaveBeenCalled();
    });

    test("handles initial fragments and malformed fragments", () => {
        const { navigate, scrollTo, scrollIntoView } = setup(["/lastoria#visit"]);
        expect(scrollIntoView).toHaveBeenCalledExactlyOnceWith({ behavior: "instant" });

        navigate("/ilgiorno#%invalid");

        expect(scrollTo).toHaveBeenCalledExactlyOnceWith({ left: 0, top: 0, behavior: "instant" });
    });
});
