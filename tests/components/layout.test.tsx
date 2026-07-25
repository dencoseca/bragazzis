/** @vitest-environment happy-dom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { Layout } from "@/components/layout/Layout";
import { themeNames } from "@/constants/themes";

const layoutMocks = vi.hoisted(() => ({
    useReducedMotion: vi.fn<() => boolean>(),
    useSmoothScroll: vi.fn(),
}));

vi.mock("motion/react", () => ({
    useReducedMotion: layoutMocks.useReducedMotion,
}));

vi.mock("@/hooks/useSmoothScroll", () => ({
    useSmoothScroll: layoutMocks.useSmoothScroll,
}));

vi.mock("@/components/layout/SiteNavigation", () => ({
    SiteNavigation() {
        return <header>Navigation</header>;
    },
}));

describe("Layout", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.clearAllMocks();
    });

    test("uses instant scrolling when reduced motion is preferred", async () => {
        const user = userEvent.setup();
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
        layoutMocks.useReducedMotion.mockReturnValue(true);

        render(
            <MemoryRouter>
                <Layout pageTitle="Test page" description="A test page" theme={themeNames.light}>
                    Page content
                </Layout>
            </MemoryRouter>,
        );

        await user.click(screen.getByRole("button", { name: "Scroll to top" }));

        expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
        expect(layoutMocks.useSmoothScroll).toHaveBeenCalledWith(false);
    });
});
