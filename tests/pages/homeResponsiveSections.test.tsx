/** @vitest-environment happy-dom */

import { fireEvent, render, screen } from "@testing-library/react";
import type { MotionValue } from "motion/react";
import type { HTMLAttributes } from "react";
import { beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { Home } from "@/pages/home/Home";
import { HomeEditorial } from "@/pages/home/HomeEditorial";
import { HomeSeasonalBanner } from "@/pages/home/HomeSeasonalBanner";

const responsiveMocks = vi.hoisted(() => ({
    useIsMobile: vi.fn<() => boolean>(),
    useIsTablet: vi.fn<() => boolean>(),
    useReducedMotion: vi.fn<() => boolean>(),
}));

interface MotionArticleProps extends Omit<HTMLAttributes<HTMLElement>, "style"> {
    style?: {
        translateY?: unknown;
    };
}

vi.mock("motion/react", () => ({
    motion: {
        article({ style, ...props }: MotionArticleProps) {
            return <article {...props} data-translate-y={String(style?.translateY)} />;
        },
    },
    useReducedMotion: responsiveMocks.useReducedMotion,
    useTransform(_scrollYProgress: unknown, _input: readonly number[], output: readonly string[]) {
        return output.join(" to ");
    },
    useScroll() {
        return { scrollYProgress: {} };
    },
}));

vi.mock("@/hooks/useMediaQuery", () => ({
    useIsMobile: responsiveMocks.useIsMobile,
    useIsTablet: responsiveMocks.useIsTablet,
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

const scrollYProgress = {} as MotionValue<number>;

function getParallaxValues(container: HTMLElement) {
    return Array.from(container.querySelectorAll("article"), (article) =>
        article.getAttribute("data-translate-y"),
    );
}

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

describe("HomeEditorial", () => {
    beforeEach(() => {
        responsiveMocks.useIsMobile.mockReturnValue(false);
        responsiveMocks.useIsTablet.mockReturnValue(false);
        responsiveMocks.useReducedMotion.mockReturnValue(false);
    });

    test("renders the editorial content and desktop image treatment", () => {
        const { container } = render(
            <HomeEditorial scrollYProgress={scrollYProgress} shouldLoadImages />,
        );

        expect(container.querySelectorAll(".home-editorial__item")).toHaveLength(4);
        expect(
            screen
                .getByRole("img", {
                    name: "Italian food and drink displayed on shop shelves",
                })
                .getAttribute("sizes"),
        ).toBe(`(max-width: ${__BREAKPOINTS__.mobile}) 100vw, 50vw`);
        expect(screen.getByText(/Bragazzi's is a cafe, delicatessen and shop/)).toBeDefined();
        expect(screen.getByText(/roasted by Darkwoods Coffee/)).toBeDefined();
        expect(screen.getByText(/trade directly with suppliers in Italy/)).toBeDefined();
        expect(screen.getByText(/fresh Italian eggs/)).toBeDefined();
        expect(getParallaxValues(container)).toEqual([
            "0vw to -59vw",
            "0vw to -118vw",
            "0vw to -59vw",
            "0vw to -29vw",
        ]);
    });

    test("removes editorial parallax on mobile and under reduced motion", () => {
        responsiveMocks.useIsMobile.mockReturnValue(true);
        const { container, rerender } = render(
            <HomeEditorial scrollYProgress={scrollYProgress} shouldLoadImages />,
        );

        expect(getParallaxValues(container)).toEqual(["0", "0", "0", "0"]);

        responsiveMocks.useIsMobile.mockReturnValue(false);
        responsiveMocks.useReducedMotion.mockReturnValue(true);
        rerender(<HomeEditorial scrollYProgress={scrollYProgress} shouldLoadImages />);

        expect(getParallaxValues(container)).toEqual(["0", "0", "0", "0"]);
    });
});

describe("HomeSeasonalBanner", () => {
    beforeEach(() => {
        responsiveMocks.useIsMobile.mockReturnValue(false);
        responsiveMocks.useIsTablet.mockReturnValue(false);
        responsiveMocks.useReducedMotion.mockReturnValue(false);
    });

    test("renders its desktop and mobile copy with the responsive image", () => {
        const { container } = render(
            <HomeSeasonalBanner scrollYProgress={scrollYProgress} shouldLoadImage />,
        );

        expect(
            screen
                .getByRole("img", {
                    name: "a gigantic italian chocolate easter egg",
                })
                .getAttribute("sizes"),
        ).toBe("100vw");
        expect(screen.getByText("Each season brings a selection of").className).toContain(
            "hide-mobile",
        );
        expect(screen.getByText("Each season").className).toContain("show-mobile");
        expect(getParallaxValues(container)).toEqual(["-2vh to 6vh"]);
    });

    test("uses tablet parallax and disables it on mobile or under reduced motion", () => {
        responsiveMocks.useIsTablet.mockReturnValue(true);
        const { container, rerender } = render(
            <HomeSeasonalBanner scrollYProgress={scrollYProgress} shouldLoadImage />,
        );

        expect(getParallaxValues(container)).toEqual(["-1vh to 3vh"]);

        responsiveMocks.useIsMobile.mockReturnValue(true);
        rerender(<HomeSeasonalBanner scrollYProgress={scrollYProgress} shouldLoadImage />);

        expect(getParallaxValues(container)).toEqual(["0"]);

        responsiveMocks.useIsMobile.mockReturnValue(false);
        responsiveMocks.useReducedMotion.mockReturnValue(true);
        rerender(<HomeSeasonalBanner scrollYProgress={scrollYProgress} shouldLoadImage />);

        expect(getParallaxValues(container)).toEqual(["0"]);
    });
});
