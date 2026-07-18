/** @vitest-environment happy-dom */

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { HTMLAttributes, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { themeNames } from "@/constants/themes";

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
    afterEach(() => {
        cleanup();
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    });

    test("owns menu state, focus, Escape handling, and scroll locking", async () => {
        const user = userEvent.setup();
        document.body.style.overflow = "clip";
        document.documentElement.style.overflow = "auto";

        render(
            <MemoryRouter>
                <SiteNavigation theme={themeNames.light} menuTheme={themeNames.dark} />
            </MemoryRouter>,
        );
        const menuButton = screen.getByRole("button", { name: "Open menu" });

        expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).toBeNull();

        await user.click(menuButton);

        const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
        const firstMenuLink = within(mobileNavigation).getAllByRole("link")[0];

        expect(mobileNavigation.id).toBe("mobile-menu");
        expect(menuButton.getAttribute("aria-expanded")).toBe("true");
        expect(document.body.style.overflow).toBe("hidden");
        expect(document.documentElement.style.overflow).toBe("hidden");
        expect(document.activeElement).toBe(firstMenuLink);

        await user.tab({ shift: true });

        expect(document.activeElement).toBe(menuButton);

        await user.tab();

        expect(document.activeElement).toBe(firstMenuLink);

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).toBeNull();
        expect(menuButton.getAttribute("aria-expanded")).toBe("false");
        expect(document.body.style.overflow).toBe("clip");
        expect(document.documentElement.style.overflow).toBe("auto");
        expect(document.activeElement).toBe(menuButton);
    });
});
