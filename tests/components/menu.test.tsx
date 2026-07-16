/** @vitest-environment happy-dom */

import type { HTMLAttributes } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { Menu } from "@/components/Menu";
import { publicPageRoutes } from "@/constants/routes";
import { themeNames } from "@/constants/themes";

import { cleanupRenderedTrees, clickElement, renderWithAct } from "../testUtils";

interface MotionDivProps extends HTMLAttributes<HTMLDivElement> {
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
    },
}));

describe("Menu", () => {
    afterEach(async () => {
        await cleanupRenderedTrees();
    });

    test("closes after selecting the current route", async () => {
        const onNavigate = vi.fn<() => void>();
        const container = await renderWithAct(
            <MemoryRouter initialEntries={[publicPageRoutes.laStoria.path]}>
                <Menu theme={themeNames.dark} onNavigate={onNavigate} />
            </MemoryRouter>,
        );
        const currentRouteLink = Array.from(
            container.querySelectorAll<HTMLAnchorElement>(".menu__link"),
        ).find((link) => link.getAttribute("href") === publicPageRoutes.laStoria.path);

        if (!currentRouteLink) {
            throw new Error("Expected the current route link to be rendered");
        }

        await clickElement(currentRouteLink);

        expect(onNavigate).toHaveBeenCalledOnce();
    });
});
