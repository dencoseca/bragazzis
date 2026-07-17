/** @vitest-environment happy-dom */

import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/constants/siteConfig";
import { themeNames } from "@/constants/themes";

import { cleanupRenderedTrees, clickElement, renderWithAct } from "../testUtils";

describe("Footer", () => {
    afterEach(async () => {
        vi.restoreAllMocks();
        await cleanupRenderedTrees();
    });

    test("renders contact links and scrolls to the top with the configured behavior", async () => {
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
        const container = await renderWithAct(
            <Footer theme={themeNames.dark} scrollToTopBehavior="auto" />,
        );

        expect(container.querySelector(".footer")?.getAttribute("data-theme")).toBe(
            themeNames.dark,
        );
        expect(
            container.querySelector<HTMLAnchorElement>(
                `a[href="mailto:${siteConfig.business.email}"]`,
            ),
        ).not.toBeNull();
        expect(
            container.querySelector<HTMLAnchorElement>(
                `a[href="${siteConfig.business.phone.href}"]`,
            ),
        ).not.toBeNull();

        const scrollButton = container.querySelector<HTMLButtonElement>(".footer__scroll-to-top");

        if (!scrollButton) {
            throw new Error("Expected scroll-to-top button to be rendered");
        }

        await clickElement(scrollButton);

        expect(scrollTo).toHaveBeenCalledWith({
            behavior: "auto",
            top: 0,
        });
    });
});
