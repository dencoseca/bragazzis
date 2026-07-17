/** @vitest-environment happy-dom */

import { act, type HTMLAttributes, type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { themeNames } from "@/constants/themes";

import { cleanupRenderedTrees, clickElement, renderWithAct } from "../testUtils";

interface MotionElementProps extends HTMLAttributes<HTMLElement> {
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
        div({ animate, exit, initial, transition, variants, ...props }: MotionElementProps) {
            void animate;
            void exit;
            void initial;
            void transition;
            void variants;

            return <div {...props} />;
        },
        nav({ animate, exit, initial, transition, variants, ...props }: MotionElementProps) {
            void animate;
            void exit;
            void initial;
            void transition;
            void variants;

            return <nav {...props} />;
        },
    },
}));

describe("SiteNavigation", () => {
    afterEach(async () => {
        await cleanupRenderedTrees();
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    });

    test("owns menu state, focus, Escape handling, and scroll locking", async () => {
        document.body.style.overflow = "clip";
        document.documentElement.style.overflow = "auto";

        const container = await renderWithAct(
            <MemoryRouter>
                <SiteNavigation theme={themeNames.light} menuTheme={themeNames.dark} />
            </MemoryRouter>,
        );
        const menuButton = container.querySelector<HTMLButtonElement>(
            ".header__mobile-menu-button",
        );

        if (!menuButton) {
            throw new Error("Expected mobile menu button to be rendered");
        }

        expect(container.querySelector("#mobile-menu")).toBeNull();

        await clickElement(menuButton);

        const firstMenuLink = container.querySelector<HTMLAnchorElement>(".menu__link");

        expect(container.querySelector("#mobile-menu")).not.toBeNull();
        expect(menuButton.getAttribute("aria-expanded")).toBe("true");
        expect(document.body.style.overflow).toBe("hidden");
        expect(document.documentElement.style.overflow).toBe("hidden");
        expect(document.activeElement).toBe(firstMenuLink);

        await act(async () => {
            document.dispatchEvent(
                new KeyboardEvent("keydown", { cancelable: true, key: "Tab", shiftKey: true }),
            );
        });

        expect(document.activeElement).toBe(menuButton);

        await act(async () => {
            document.dispatchEvent(new KeyboardEvent("keydown", { cancelable: true, key: "Tab" }));
        });

        expect(document.activeElement).toBe(firstMenuLink);

        await act(async () => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        });

        expect(container.querySelector("#mobile-menu")).toBeNull();
        expect(menuButton.getAttribute("aria-expanded")).toBe("false");
        expect(document.body.style.overflow).toBe("clip");
        expect(document.documentElement.style.overflow).toBe("auto");
        expect(document.activeElement).toBe(menuButton);
    });
});
