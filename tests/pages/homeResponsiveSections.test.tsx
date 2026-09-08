/** @vitest-environment happy-dom */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vite-plus/test";

import { Home } from "@/pages/home/Home";
import { HomeEditorial } from "@/pages/home/HomeEditorial";
import { HomeSeasonalBanner } from "@/pages/home/HomeSeasonalBanner";

vi.mock("motion/react", () => ({
    useScroll() {
        return { scrollYProgress: {} };
    },
}));

vi.mock("@/components/OptimizedImage", () => ({
    OptimizedImage({
        alt,
        className,
        shouldLoad,
        sizes,
    }: {
        alt: string;
        className?: string;
        shouldLoad?: boolean;
        sizes: string;
    }) {
        return (
            <picture className={className}>
                <img alt={alt} sizes={sizes} data-should-load={String(shouldLoad)} />
            </picture>
        );
    },
}));

vi.mock("@/pages/home/HomeHero", () => ({
    HomeHero({ onSettled }: { onSettled?: () => void }) {
        return (
            <button type="button" onClick={onSettled}>
                Settle hero
            </button>
        );
    },
}));

vi.mock("@/assets/images/ciabatta.jpg?preset=editorial", () => ({ default: {} }));
vi.mock("@/assets/images/coffee-pour.jpg?preset=editorial", () => ({ default: {} }));
vi.mock("@/assets/images/shelves.jpg?preset=editorial", () => ({ default: {} }));
vi.mock("@/assets/images/shop-christmas.jpg?preset=editorial", () => ({ default: {} }));
vi.mock("@/assets/images/egg.jpg?preset=fullWidth", () => ({ default: {} }));

describe("Home image loading", () => {
    test("starts loading every below-fold image after the hero settles", () => {
        render(<Home />);

        const images = screen.getAllByRole("img");
        expect(images).toHaveLength(5);
        expect(images.map((image) => image.dataset.shouldLoad)).toEqual(images.map(() => "false"));

        fireEvent.click(screen.getByRole("button", { name: "Settle hero" }));

        expect(images.map((image) => image.dataset.shouldLoad)).toEqual(images.map(() => "true"));
    });
});

describe("Home editorial content", () => {
    test("preserves the shop, coffee, supplier and produce copy", () => {
        const { container } = render(<HomeEditorial shouldLoadImages />);
        expect(container.querySelectorAll(".home-editorial__item")).toHaveLength(4);
        expect(
            screen
                .getByRole("img", { name: "Italian food and drink displayed on shop shelves" })
                .getAttribute("sizes"),
        ).toBe(`(max-width: ${__BREAKPOINTS__.mobile}) 100vw, 50vw`);
        expect(screen.getByText(/Bragazzi's is a cafe, delicatessen and shop/)).toBeDefined();
        expect(screen.getByText(/roasted by Darkwoods Coffee/)).toBeDefined();
        expect(screen.getByText(/trade directly with suppliers in Italy/)).toBeDefined();
        expect(screen.getByText(/fresh Italian eggs/)).toBeDefined();
    });

    test("uses one seasonal heading across viewport sizes", () => {
        render(<HomeSeasonalBanner shouldLoadImage />);
        expect(
            screen.getByRole("heading", {
                name: "Each season brings a selection of well considered products",
            }),
        ).toBeDefined();
        expect(
            screen
                .getByRole("img", { name: "a gigantic italian chocolate easter egg" })
                .getAttribute("sizes"),
        ).toBe(`(max-width: ${__BREAKPOINTS__.mobile}) 100vw, 50vw`);
    });
});
