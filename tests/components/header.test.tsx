/** @vitest-environment happy-dom */

import type { HTMLAttributes } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { Header } from "@/components/Header";
import { publicPageRoutes } from "@/constants/routes";
import { themeNames } from "@/constants/themes";

import { cleanupRenderedTrees, clickElement, renderWithAct } from "../testUtils";

interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
    animate?: unknown;
    initial?: unknown;
    transition?: unknown;
    variants?: unknown;
}

vi.mock("motion/react", () => ({
    motion: {
        div({ animate, initial, transition, variants, ...props }: MotionDivProps) {
            void initial;
            void transition;
            void variants;

            return <div {...props} data-animate={String(animate)} />;
        },
    },
}));

describe("Header", () => {
    afterEach(async () => {
        await cleanupRenderedTrees();
    });

    test("renders navigation and opens the mobile menu", async () => {
        const setMenuIsOpen = vi.fn<(open: boolean) => void>();
        const container = await renderWithAct(
            <MemoryRouter>
                <Header
                    menuIsOpen={false}
                    setMenuIsOpen={setMenuIsOpen}
                    theme={themeNames.light}
                    menuTheme={themeNames.dark}
                />
            </MemoryRouter>,
        );

        const header = container.querySelector(".header");
        const menuButton = container.querySelector<HTMLButtonElement>(
            ".header__mobile-menu-button",
        );
        const links = Array.from(container.querySelectorAll<HTMLAnchorElement>(".header__link"));
        const hamburgerLines = Array.from(container.querySelectorAll(".line"));

        expect(header?.getAttribute("data-theme")).toBe(themeNames.light);
        expect(header?.getAttribute("data-menu-open")).toBe("false");
        expect(menuButton?.getAttribute("aria-expanded")).toBe("false");
        expect(hamburgerLines.map((line) => line.getAttribute("data-animate"))).toEqual([
            "closed",
            "closed",
        ]);
        expect(links.map((link) => link.getAttribute("href"))).toEqual([
            publicPageRoutes.laStoria.path,
            publicPageRoutes.ilGiorno.path,
        ]);

        if (!menuButton) {
            throw new Error("Expected mobile menu button to be rendered");
        }

        await clickElement(menuButton);

        expect(setMenuIsOpen).toHaveBeenCalledWith(true);
    });

    test("uses the menu theme while open and closes the mobile menu", async () => {
        const setMenuIsOpen = vi.fn<(open: boolean) => void>();
        const container = await renderWithAct(
            <MemoryRouter>
                <Header
                    menuIsOpen
                    setMenuIsOpen={setMenuIsOpen}
                    theme={themeNames.light}
                    menuTheme={themeNames.dark}
                />
            </MemoryRouter>,
        );

        const header = container.querySelector(".header");
        const menuButton = container.querySelector<HTMLButtonElement>(
            ".header__mobile-menu-button",
        );
        const hamburgerLines = Array.from(container.querySelectorAll(".line"));

        expect(header?.getAttribute("data-theme")).toBe(themeNames.dark);
        expect(header?.getAttribute("data-menu-open")).toBe("true");
        expect(menuButton?.getAttribute("aria-expanded")).toBe("true");
        expect(hamburgerLines.map((line) => line.getAttribute("data-animate"))).toEqual([
            "open",
            "open",
        ]);

        if (!menuButton) {
            throw new Error("Expected mobile menu button to be rendered");
        }

        await clickElement(menuButton);

        expect(setMenuIsOpen).toHaveBeenCalledWith(false);
    });
});
