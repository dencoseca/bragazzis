/** @vitest-environment happy-dom */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { Footer } from "@/components/layout/Footer";
import { visitSectionId } from "@/constants/routes";
import { siteConfig } from "@/constants/siteConfig";
import { themeNames } from "@/constants/themes";

describe("Footer", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("renders the visit details and scrolls to the top with the configured behavior", async () => {
        const user = userEvent.setup();
        const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
        const { address, email, phone } = siteConfig.business;
        render(<Footer theme={themeNames.accent} scrollToTopBehavior="auto" />);

        const footer = screen.getByRole("contentinfo");

        expect(footer.id).toBe(visitSectionId);
        expect(footer.getAttribute("data-theme")).toBe(themeNames.accent);
        expect(
            screen.getByRole("link", { name: /224–228 Abbeydale Road/ }).getAttribute("href"),
        ).toBe(address.mapsUrl);
        expect(
            Array.from(footer.querySelectorAll(".opening-hours__row"), (row) => row.textContent),
        ).toEqual(["Mon – Thur9:00 – 15:00", "Fri – Sat9:00 – 16:15", "SunClosed"]);
        expect(screen.getByRole("link", { name: email }).getAttribute("href")).toBe(
            `mailto:${email}`,
        );
        expect(screen.getByRole("link", { name: phone.display }).getAttribute("href")).toBe(
            phone.href,
        );

        const communityLinks = screen.getByRole("heading", { name: "Social" }).parentElement;

        expect(communityLinks?.classList.contains("footer__list--community")).toBe(true);
        for (const link of siteConfig.links.social) {
            expect(screen.getByRole("link", { name: link.label }).getAttribute("href")).toBe(
                link.url,
            );
        }

        await user.click(screen.getByRole("button", { name: "Back to top" }));

        expect(scrollTo).toHaveBeenCalledWith({
            behavior: "auto",
            top: 0,
        });
    });
});
