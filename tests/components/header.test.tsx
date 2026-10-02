/** @vitest-environment happy-dom */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { HTMLAttributes, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vite-plus/test";

import { Header } from "@/components/layout/Header";
import { publicPageRoutes, visitSectionId } from "@/constants/routes";
import { themeNames } from "@/constants/themes";

interface MotionSpanProps extends HTMLAttributes<HTMLSpanElement> {
    animate?: unknown;
    exit?: unknown;
    initial?: unknown;
    transition?: unknown;
    variants?: unknown;
}

vi.mock("motion/react", () => ({
    AnimatePresence({ children }: { children: ReactNode }) {
        return children;
    },
    motion: {
        span({ animate, exit, initial, transition, variants, ...props }: MotionSpanProps) {
            void animate;
            void exit;
            void initial;
            void transition;
            void variants;

            return <span {...props} />;
        },
    },
}));

function renderHeader(menuIsOpen: boolean, onMenuToggle = vi.fn<() => void>()) {
    render(
        <MemoryRouter initialEntries={[publicPageRoutes.laStoria.path]}>
            <Header
                menuIsOpen={menuIsOpen}
                onMenuToggle={onMenuToggle}
                menuButtonRef={null}
                menuId="mobile-menu"
                theme={themeNames.light}
                menuTheme={themeNames.dark}
            />
        </MemoryRouter>,
    );

    return onMenuToggle;
}

describe("Header", () => {
    test("links to every page, marks the current one, and offers the visit details", async () => {
        const user = userEvent.setup();
        const onMenuToggle = renderHeader(false);

        const header = screen.getByRole("banner");
        const menuButton = screen.getByRole("button", { name: "Open menu" });
        const links = within(
            screen.getByRole("navigation", { name: "Primary navigation" }),
        ).getAllByRole("link");

        expect(header.getAttribute("data-theme")).toBe(themeNames.light);
        expect(header.getAttribute("data-menu-open")).toBe("false");
        expect(menuButton.getAttribute("aria-expanded")).toBe("false");
        expect(menuButton.getAttribute("aria-controls")).toBe("mobile-menu");
        expect(menuButton.textContent).toBe("Menu");
        expect(links.map((link) => link.getAttribute("href"))).toEqual([
            publicPageRoutes.home.path,
            publicPageRoutes.laStoria.path,
            publicPageRoutes.ilGiorno.path,
            `#${visitSectionId}`,
        ]);
        expect(links.map((link) => link.getAttribute("aria-current"))).toEqual([
            null,
            "page",
            null,
            null,
        ]);

        await user.click(menuButton);

        expect(onMenuToggle).toHaveBeenCalledOnce();
    });

    test("uses the menu theme while open and hides the page links behind it", async () => {
        const user = userEvent.setup();
        const onMenuToggle = renderHeader(true);

        const header = screen.getByRole("banner");
        const menuButton = screen.getByRole("button", { name: "Close menu" });

        expect(header.getAttribute("data-theme")).toBe(themeNames.dark);
        expect(header.getAttribute("data-menu-open")).toBe("true");
        expect(menuButton.getAttribute("aria-expanded")).toBe("true");
        expect(menuButton.textContent).toBe("Close");
        expect(screen.queryByRole("navigation", { name: "Primary navigation" })).toBeNull();

        await user.click(menuButton);

        expect(onMenuToggle).toHaveBeenCalledOnce();
    });
});
