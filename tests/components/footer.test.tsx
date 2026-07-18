/** @vitest-environment happy-dom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/constants/siteConfig";
import { themeNames } from "@/constants/themes";

describe("Footer", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("renders contact links and scrolls to the top with the configured behavior", async () => {
        const user = userEvent.setup();
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
        render(<Footer theme={themeNames.dark} scrollToTopBehavior="auto" />);

        expect(screen.getByRole("contentinfo").getAttribute("data-theme")).toBe(themeNames.dark);
        expect(
            screen.getByRole("link", { name: siteConfig.business.email }).getAttribute("href"),
        ).toBe(`mailto:${siteConfig.business.email}`);
        expect(
            screen
                .getByRole("link", { name: siteConfig.business.phone.display })
                .getAttribute("href"),
        ).toBe(siteConfig.business.phone.href);

        await user.click(screen.getByRole("button", { name: "Scroll to top" }));

        expect(scrollTo).toHaveBeenCalledWith({
            behavior: "auto",
            top: 0,
        });
    });
});
