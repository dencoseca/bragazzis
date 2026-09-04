/** @vitest-environment happy-dom */

import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { SiteNavigation } from "@/components/layout/SiteNavigation";
import { themeNames } from "@/constants/themes";

vi.mock("@/hooks/useMediaQuery", () => ({ useIsMobile: () => true }));

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

function NavigationTestHarness({
    backgroundAriaHidden = "false",
}: {
    backgroundAriaHidden?: "false" | null;
}) {
    const backgroundContentRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    return (
        <>
            <SiteNavigation
                backgroundContentRef={backgroundContentRef}
                theme={themeNames.light}
                menuTheme={themeNames.dark}
            />
            <div ref={backgroundContentRef} aria-hidden={backgroundAriaHidden ?? undefined}>
                <button type="button" onClick={() => void navigate("/la-storia")}>
                    Change route
                </button>
            </div>
        </>
    );
}

describe("SiteNavigation", () => {
    afterEach(() => {
        cleanup();
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
    });

    test("makes the menu modal, traps focus, and restores background state", async () => {
        const user = userEvent.setup();
        document.body.style.overflow = "clip";
        document.documentElement.style.overflow = "auto";

        render(
            <MemoryRouter>
                <NavigationTestHarness />
            </MemoryRouter>,
        );
        const menuButton = screen.getByRole("button", { name: "Open menu" });
        const backgroundContent = screen.getByRole("button", {
            name: "Change route",
        }).parentElement;

        expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).toBeNull();

        await user.click(menuButton);

        const dialog = screen.getByRole("dialog", { name: "Mobile navigation" });
        const menuLinks = within(dialog).getAllByRole("link");
        const firstMenuLink = menuLinks[0];
        const lastMenuLink = menuLinks.at(-1);

        expect(dialog.id).toBe("mobile-menu");
        expect(dialog.getAttribute("aria-modal")).toBe("true");
        expect(menuButton.getAttribute("aria-expanded")).toBe("true");
        expect(backgroundContent?.inert).toBe(true);
        expect(backgroundContent?.getAttribute("aria-hidden")).toBe("true");
        expect(screen.queryByRole("button", { name: "Change route" })).toBeNull();
        expect(document.body.style.overflow).toBe("hidden");
        expect(document.documentElement.style.overflow).toBe("hidden");
        expect(document.activeElement).toBe(firstMenuLink);

        await user.tab({ shift: true });

        expect(document.activeElement).toBe(menuButton);

        await user.tab({ shift: true });

        expect(document.activeElement).toBe(lastMenuLink);

        await user.tab();

        expect(document.activeElement).toBe(menuButton);

        await user.tab();

        expect(document.activeElement).toBe(firstMenuLink);

        await user.keyboard("{Escape}");

        expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).toBeNull();
        expect(menuButton.getAttribute("aria-expanded")).toBe("false");
        expect(backgroundContent?.inert).toBe(false);
        expect(backgroundContent?.getAttribute("aria-hidden")).toBe("false");
        expect(document.body.style.overflow).toBe("clip");
        expect(document.documentElement.style.overflow).toBe("auto");
        expect(document.activeElement).toBe(menuButton);
    });

    test("closes and restores focus after selecting a menu link", async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <NavigationTestHarness />
            </MemoryRouter>,
        );
        const menuButton = screen.getByRole("button", { name: "Open menu" });

        await user.click(menuButton);
        await user.click(
            within(screen.getByRole("dialog", { name: "Mobile navigation" })).getAllByRole(
                "link",
            )[0],
        );

        expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).toBeNull();
        expect(document.activeElement).toBe(menuButton);
    });

    test("closes without returning focus to the toggle after the route changes", async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <NavigationTestHarness />
            </MemoryRouter>,
        );
        const menuButton = screen.getByRole("button", { name: "Open menu" });
        const routeButton = screen.getByRole("button", { name: "Change route" });

        await user.click(menuButton);

        act(() => {
            routeButton.click();
        });

        expect(screen.queryByRole("dialog", { name: "Mobile navigation" })).toBeNull();
        expect(document.activeElement).not.toBe(menuButton);
    });

    test("restores an absent background aria-hidden attribute", async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <NavigationTestHarness backgroundAriaHidden={null} />
            </MemoryRouter>,
        );
        const menuButton = screen.getByRole("button", { name: "Open menu" });
        const backgroundContent = screen.getByRole("button", {
            name: "Change route",
        }).parentElement;

        expect(backgroundContent?.hasAttribute("aria-hidden")).toBe(false);

        await user.click(menuButton);

        expect(backgroundContent?.getAttribute("aria-hidden")).toBe("true");

        await user.keyboard("{Escape}");

        expect(backgroundContent?.hasAttribute("aria-hidden")).toBe(false);
    });
});
