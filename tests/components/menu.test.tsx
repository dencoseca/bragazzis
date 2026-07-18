/** @vitest-environment happy-dom */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { HTMLAttributes } from "react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vite-plus/test";

import { Menu } from "@/components/layout/Menu";
import { publicPageRoutes } from "@/constants/routes";
import { themeNames } from "@/constants/themes";

interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
    animate?: unknown;
    exit?: unknown;
    initial?: unknown;
    variants?: unknown;
}

interface MotionNavProps extends HTMLAttributes<HTMLElement> {
    animate?: unknown;
    exit?: unknown;
    initial?: unknown;
    variants?: unknown;
}

vi.mock("motion/react", () => ({
    motion: {
        div({ animate, exit, initial, variants, ...props }: MotionDivProps) {
            void animate;
            void exit;
            void initial;
            void variants;

            return <div {...props} />;
        },
        nav({ animate, exit, initial, variants, ...props }: MotionNavProps) {
            void animate;
            void exit;
            void initial;
            void variants;

            return <nav {...props} />;
        },
    },
}));

describe("Menu", () => {
    test("closes after selecting the current route", async () => {
        const user = userEvent.setup();
        const onNavigate = vi.fn<() => void>();
        render(
            <MemoryRouter initialEntries={[publicPageRoutes.laStoria.path]}>
                <Menu id="mobile-menu" theme={themeNames.dark} onNavigate={onNavigate} />
            </MemoryRouter>,
        );
        const navigation = screen.getByRole("navigation", { name: "Mobile navigation" });
        const currentRouteLink = within(navigation).getByRole("link", {
            name: publicPageRoutes.laStoria.label,
        });

        await user.click(currentRouteLink);

        expect(onNavigate).toHaveBeenCalledOnce();
    });
});
