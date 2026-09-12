/** @vitest-environment happy-dom */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { HTMLAttributes } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vite-plus/test";

import { Header } from "@/components/layout/Header";
import { publicPageRoutes } from "@/constants/routes";
import { themeNames } from "@/constants/themes";

interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
    animate?: unknown;
    initial?: unknown;
    transition?: unknown;
    variants?: unknown;
}

vi.mock("motion/react", () => ({
    motion: {
        div({ animate, initial, transition, variants, ...props }: MotionDivProps) {
            void animate;
            void initial;
            void transition;
            void variants;

            return <div {...props} />;
        },
    },
}));

describe("Header", () => {
    test.each([themeNames.light, themeNames.dark])(
        "keeps the %s page theme when the menu opens",
        (theme) => {
            const props = {
                onMenuToggle: vi.fn(),
                menuButtonRef: null,
                menuId: "mobile-menu",
                theme,
            };
            const { rerender } = render(
                <MemoryRouter>
                    <Header {...props} menuIsOpen={false} />
                </MemoryRouter>,
            );
            expect(screen.getByRole("banner").getAttribute("data-theme")).toBe(theme);
            rerender(
                <MemoryRouter>
                    <Header {...props} menuIsOpen />
                </MemoryRouter>,
            );
            expect(screen.getByRole("banner").getAttribute("data-theme")).toBe(theme);
            const closeButton = screen.getByRole("button", { name: "Close menu" });
            expect(closeButton.getAttribute("aria-expanded")).toBe("true");
            expect(closeButton.getAttribute("aria-controls")).toBe("mobile-menu");
            expect(screen.queryByRole("navigation", { name: "Primary navigation" })).toBeNull();
        },
    );

    test("renders route links and requests opening the menu", async () => {
        const user = userEvent.setup();
        const onMenuToggle = vi.fn<() => void>();
        render(
            <MemoryRouter>
                <Header
                    menuIsOpen={false}
                    onMenuToggle={onMenuToggle}
                    menuButtonRef={null}
                    menuId="mobile-menu"
                    theme={themeNames.light}
                />
            </MemoryRouter>,
        );

        const header = screen.getByRole("banner");
        const menuButton = screen.getByRole("button", { name: "Open menu" });
        const links = within(
            screen.getByRole("navigation", { name: "Primary navigation" }),
        ).getAllByRole("link");

        expect(header?.getAttribute("data-theme")).toBe(themeNames.light);
        expect(header?.getAttribute("data-menu-open")).toBe("false");
        expect(menuButton?.getAttribute("aria-expanded")).toBe("false");
        expect(menuButton?.getAttribute("aria-controls")).toBe("mobile-menu");
        expect(menuButton?.getAttribute("aria-label")).toBe("Open menu");
        expect(links.map((link) => link.getAttribute("href"))).toEqual([
            publicPageRoutes.home.path,
            publicPageRoutes.laStoria.path,
            publicPageRoutes.ilGiorno.path,
        ]);

        await user.click(menuButton);

        expect(onMenuToggle).toHaveBeenCalledOnce();
    });
});
