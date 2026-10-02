/** @vitest-environment happy-dom */

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { HTMLAttributes } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { publicPageRoutes } from "@/constants/routes";
import { Home } from "@/pages/home/Home";
import { HomeContinue } from "@/pages/home/HomeContinue";
import { HomeEditorial } from "@/pages/home/HomeEditorial";
import { HomeSeasonal } from "@/pages/home/HomeSeasonal";

const responsiveMocks = vi.hoisted(() => ({
    useIsMobile: vi.fn<() => boolean>(),
    useIsTablet: vi.fn<() => boolean>(),
    useReducedMotion: vi.fn<() => boolean>(),
}));

interface MotionDivProps extends Omit<HTMLAttributes<HTMLDivElement>, "style"> {
    style?: {
        y?: unknown;
    };
}

vi.mock("motion/react", () => ({
    motion: {
        div({ style, ...props }: MotionDivProps) {
            return <div {...props} data-y={String(style?.y)} />;
        },
    },
    useReducedMotion: responsiveMocks.useReducedMotion,
    useScroll() {
        return { scrollYProgress: {} };
    },
    useTransform(_scrollYProgress: unknown, _input: readonly number[], output: readonly string[]) {
        return output.join(" to ");
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
        "data-active": dataActive,
    }: {
        alt: string;
        className?: string;
        shouldLoad?: boolean;
        sizes: string;
        "data-active"?: boolean;
    }) {
        return (
            <picture className={className} data-active={dataActive}>
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
vi.mock("@/assets/images/early-days.jpg?preset=editorial", () => ({ default: {} }));
vi.mock("@/assets/images/egg.jpg?preset=editorial", () => ({ default: {} }));
vi.mock("@/assets/images/gallery/aperto.jpg?preset=gallery", () => ({ default: {} }));
vi.mock("@/assets/images/last-goodbyes-color.jpg?preset=editorial", () => ({ default: {} }));
vi.mock("@/assets/images/shelves.jpg?preset=editorial", () => ({ default: {} }));
vi.mock("@/assets/images/shop-christmas.jpg?preset=editorial", () => ({ default: {} }));
vi.mock("@/assets/images/shopfront.jpg?preset=fullWidth", () => ({ default: {} }));

class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];

    readonly observe = vi.fn((element: Element) => {
        this.observedElements.push(element);
    });
    readonly unobserve = vi.fn();
    readonly disconnect = vi.fn();
    readonly takeRecords = vi.fn(() => []);
    readonly root = null;
    readonly rootMargin: string;
    readonly thresholds: readonly number[] = [];
    readonly observedElements: Element[] = [];

    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        this.rootMargin = options?.rootMargin ?? "";
        MockIntersectionObserver.instances.push(this);
    }

    trigger(target: Element, isIntersecting: boolean) {
        this.callback(
            [{ isIntersecting, target } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
        );
    }
}

function getEditorialObserver() {
    const observer = MockIntersectionObserver.instances.find(
        ({ rootMargin }) => rootMargin === "-50% 0px -50% 0px",
    );

    if (!observer) {
        throw new Error("Expected the editorial chapters to be observed");
    }

    return observer;
}

function getActiveImageAlts() {
    return Array.from(document.querySelectorAll('[data-active="true"] img'), (image) =>
        image.getAttribute("alt"),
    );
}

beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    responsiveMocks.useIsMobile.mockReturnValue(false);
    responsiveMocks.useIsTablet.mockReturnValue(false);
    responsiveMocks.useReducedMotion.mockReturnValue(false);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("Home image loading", () => {
    test("starts loading every below-fold image after the hero settles", () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>,
        );

        // The continue-reading thumbnails are decorative, so count every image element.
        const images = Array.from(document.querySelectorAll("img"));
        expect(images).toHaveLength(9);
        expect(images.map((image) => image.dataset.shouldLoad)).toEqual(images.map(() => "false"));

        fireEvent.click(screen.getByRole("button", { name: "Settle hero" }));

        expect(images.map((image) => image.dataset.shouldLoad)).toEqual(images.map(() => "true"));
    });
});

describe("HomeEditorial", () => {
    test("cross-fades a single picture frame as each chapter reaches the middle of the screen", () => {
        render(<HomeEditorial shouldLoadImages />);

        const chapters = screen.getAllByRole("listitem");
        const observer = getEditorialObserver();

        expect(
            screen.getAllByRole("heading", { level: 2 }).map(({ textContent }) => textContent),
        ).toEqual(["Il Caffè", "I Fornitori", "La Dispensa"]);
        expect(screen.getByText(/roasted by Darkwoods Coffee/)).toBeDefined();
        expect(screen.getByText(/trade directly with suppliers in Italy/)).toBeDefined();
        expect(screen.getByText(/fresh Italian eggs/)).toBeDefined();
        expect(observer.observedElements).toEqual(chapters);
        expect(getActiveImageAlts()).toEqual(["silky coffee being poured"]);
        expect(screen.getByText("01 / 03")).toBeDefined();

        act(() => observer.trigger(chapters[2], true));

        expect(getActiveImageAlts()).toEqual(["Italian food and drink displayed on shop shelves"]);
        expect(screen.getByText("03 / 03")).toBeDefined();

        act(() => observer.trigger(chapters[1], false));

        expect(getActiveImageAlts()).toEqual(["Italian food and drink displayed on shop shelves"]);
    });

    test("shows each picture inside its chapter on mobile", () => {
        responsiveMocks.useIsMobile.mockReturnValue(true);
        render(<HomeEditorial shouldLoadImages />);

        const chapters = screen.getAllByRole("listitem");

        expect(
            chapters.map((chapter) => within(chapter).getByRole("img").getAttribute("alt")),
        ).toEqual([
            "silky coffee being poured",
            "ciabatta sandwiches being prepared",
            "Italian food and drink displayed on shop shelves",
        ]);
        expect(document.querySelector(".home-editorial__media")).toBeNull();
        expect(
            MockIntersectionObserver.instances.some(
                ({ rootMargin }) => rootMargin === "-50% 0px -50% 0px",
            ),
        ).toBe(false);
    });
});

describe("HomeSeasonal", () => {
    function getChristmasParallax() {
        return document.querySelector(".home-seasonal__figure--christmas")?.getAttribute("data-y");
    }

    test("pairs the Easter and Christmas photographs under the seasonal statement", () => {
        render(<HomeSeasonal shouldLoadImages />);

        expect(
            screen.getByRole("heading", {
                name: "Each season brings a selection of well considered products",
            }),
        ).toBeDefined();
        expect(screen.getByText("Pasqua")).toBeDefined();
        expect(screen.getByText("Natale")).toBeDefined();
        expect(getChristmasParallax()).toBe("5vw to -9vw");
    });

    test("uses tablet parallax and disables it on mobile or under reduced motion", () => {
        responsiveMocks.useIsTablet.mockReturnValue(true);
        const { rerender } = render(<HomeSeasonal shouldLoadImages />);

        expect(getChristmasParallax()).toBe("3vw to -6vw");

        responsiveMocks.useIsMobile.mockReturnValue(true);
        rerender(<HomeSeasonal shouldLoadImages />);

        expect(getChristmasParallax()).toBe("0");

        responsiveMocks.useIsMobile.mockReturnValue(false);
        responsiveMocks.useReducedMotion.mockReturnValue(true);
        rerender(<HomeSeasonal shouldLoadImages />);

        expect(getChristmasParallax()).toBe("0");
    });
});

describe("HomeContinue", () => {
    test("links on to the other two pages", () => {
        render(
            <MemoryRouter>
                <HomeContinue shouldLoadImages />
            </MemoryRouter>,
        );

        const links = within(screen.getByRole("navigation", { name: "Continue reading" }))
            .getAllByRole("link")
            .map((link) => ({ name: link.textContent, href: link.getAttribute("href") }));

        expect(links).toEqual([
            { name: "La StoriaThe story of Bragazzi’s ", href: publicPageRoutes.laStoria.path },
            { name: "Il GiornoA day at Bragazzi’s ", href: publicPageRoutes.ilGiorno.path },
        ]);
    });
});
