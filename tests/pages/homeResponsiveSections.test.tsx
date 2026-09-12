/** @vitest-environment happy-dom */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vite-plus/test";

import { Home } from "@/pages/home/Home";

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
        expect(images.map((image) => image.getAttribute("sizes"))).toEqual(
            Array.from({ length: 5 }, () => `(max-width: ${__BREAKPOINTS__.mobile}) 100vw, 50vw`),
        );
        expect(images.map((image) => image.dataset.shouldLoad)).toEqual(images.map(() => "false"));

        fireEvent.click(screen.getByRole("button", { name: "Settle hero" }));

        expect(images.map((image) => image.dataset.shouldLoad)).toEqual(images.map(() => "true"));
    });
});
