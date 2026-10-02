/** @vitest-environment happy-dom */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { IlGiornoGallery } from "@/pages/il-giorno/IlGiornoGallery";

const tokensScss = readFileSync(resolve(process.cwd(), "src/styles/_tokens.scss"), "utf8");

const galleryImages = vi.hoisted(() =>
    Array.from({ length: 12 }, (_, index) => ({
        alt: `gallery image ${index}`,
        filename: `gallery-${index}.jpg`,
        image: {
            img: {
                h: 100,
                src: `/gallery-${index}.jpg`,
                w: 100,
            },
            sources: {
                "image/avif": `/gallery-${index}.avif`,
            },
        },
        placement: index % 2 === 0 ? "half-left" : "narrow-right",
    })),
);

vi.mock("@/pages/il-giorno/galleryImages", () => ({
    galleryImages,
}));

class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];

    readonly root = null;
    readonly rootMargin: string;
    readonly thresholds: readonly number[] = [];

    readonly disconnect = vi.fn();
    readonly observe = vi.fn((element: Element) => {
        this.observedElements.push(element);
    });
    readonly takeRecords = vi.fn(() => []);
    readonly unobserve = vi.fn();

    readonly observedElements: Element[] = [];

    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        this.rootMargin = options?.rootMargin ?? "";
        MockIntersectionObserver.instances.push(this);
    }

    trigger(target: Element, isIntersecting: boolean) {
        this.callback(
            [
                {
                    isIntersecting,
                    target,
                } as IntersectionObserverEntry,
            ],
            this as unknown as IntersectionObserver,
        );
    }
}

function installIntersectionObserverMock() {
    MockIntersectionObserver.instances = [];
    window.IntersectionObserver =
        MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

// Gallery figures also register with the shared reveal observer, so find the load-ahead one.
function getLoadAheadObserver() {
    const observer = MockIntersectionObserver.instances.find(
        ({ rootMargin }) => rootMargin === "1200px 0px",
    );

    if (!observer) {
        throw new Error("Expected the gallery load-ahead observer");
    }

    return observer;
}

function removeIntersectionObserver() {
    Reflect.deleteProperty(window, "IntersectionObserver");
}

function getGalleryPictures() {
    return screen.getAllByRole("img").map((image) => {
        const picture = image.closest("picture");

        if (!picture) {
            throw new Error("Expected each gallery image to be wrapped in a picture");
        }

        return picture;
    });
}

function getLoadStates() {
    return screen.getAllByRole("img").map((image) => ({
        loading: image.getAttribute("loading"),
        shouldLoad: image.getAttribute("src")?.startsWith("data:image/svg+xml") ? "false" : "true",
    }));
}

function getSassMobileBreakpoint() {
    const tokenMatch = tokensScss.match(/\$breakpoint-mobile:\s*([^;]+);/);
    const breakpointValue = tokenMatch?.[1]?.trim();

    if (!breakpointValue) {
        throw new Error("Expected the Sass mobile breakpoint token");
    }

    return breakpointValue;
}

describe("IlGiornoGallery", () => {
    afterEach(() => {
        removeIntersectionObserver();
    });

    test("preserves captions, image ordering, placements, and responsive sizes", () => {
        render(<IlGiornoGallery />);

        const gallery = screen.getByText("Aperto").parentElement;
        const pictures = getGalleryPictures();
        const mobileQuery = `(max-width: ${getSassMobileBreakpoint()})`;

        expect(gallery?.firstElementChild?.textContent).toBe("Aperto");
        expect(gallery?.lastElementChild?.textContent).toBe("Chiuso");
        expect(screen.getAllByRole("img").map((image) => image.getAttribute("alt"))).toEqual(
            galleryImages.map(({ alt }) => alt),
        );
        expect(screen.getAllByRole("img").map((image) => image.getAttribute("sizes"))).toEqual(
            galleryImages.map(({ placement }) =>
                placement === "half-left"
                    ? `${mobileQuery} 85vw, 50vw`
                    : `${mobileQuery} 50vw, 34vw`,
            ),
        );
        expect(pictures.map((picture) => picture.closest("figure")?.dataset.placement)).toEqual(
            galleryImages.map(({ placement }) => placement),
        );
        expect(pictures.map((picture) => picture.closest("figure")?.textContent)).toEqual(
            galleryImages.map((_, index) => String(index + 1).padStart(2, "0")),
        );
    });

    test("loads every gallery image when IntersectionObserver is unavailable", () => {
        removeIntersectionObserver();

        render(<IlGiornoGallery />);

        const images = screen.getAllByRole("img");

        expect(images[0].getAttribute("loading")).toBe("eager");
        expect(images[0].getAttribute("decoding")).toBe("sync");
        expect(images[0].getAttribute("fetchpriority")).toBe("high");
        expect(getLoadStates()).toEqual(
            galleryImages.map(() => ({
                loading: "eager",
                shouldLoad: "true",
            })),
        );
    });

    test("starts with two images and loads three ahead after intersection", async () => {
        installIntersectionObserverMock();

        render(<IlGiornoGallery />);

        const observer = getLoadAheadObserver();
        const initialPictures = getGalleryPictures();

        expect(observer).toBeDefined();
        expect(observer.rootMargin).toBe("1200px 0px");
        expect(observer.observedElements).toHaveLength(galleryImages.length);
        expect(getLoadStates()).toEqual([
            ...Array.from({ length: 2 }, () => ({
                loading: "eager",
                shouldLoad: "true",
            })),
            ...Array.from({ length: 10 }, () => ({
                loading: "lazy",
                shouldLoad: "false",
            })),
        ]);

        await act(async () => {
            observer.trigger(initialPictures[2], false);
        });

        expect(getLoadStates()[5]).toEqual({
            loading: "lazy",
            shouldLoad: "false",
        });

        await act(async () => {
            observer.trigger(initialPictures[2], true);
        });

        expect(getLoadStates()).toEqual([
            ...Array.from({ length: 6 }, () => ({
                loading: "eager",
                shouldLoad: "true",
            })),
            ...Array.from({ length: 6 }, () => ({
                loading: "lazy",
                shouldLoad: "false",
            })),
        ]);
    });

    test("marks each image as loaded for its reveal animation", async () => {
        render(<IlGiornoGallery />);

        const images = screen.getAllByRole("img");
        const pictures = getGalleryPictures();

        expect(pictures.map((picture) => picture.dataset.imageLoaded)).toEqual(
            galleryImages.map(() => "false"),
        );

        fireEvent.load(images[0]);

        await waitFor(() => expect(pictures[0].dataset.imageLoaded).toBe("true"));
        expect(pictures.slice(1).map((picture) => picture.dataset.imageLoaded)).toEqual(
            galleryImages.slice(1).map(() => "false"),
        );
    });

    test("disconnects the observer when the gallery unmounts", () => {
        installIntersectionObserverMock();

        const { unmount } = render(<IlGiornoGallery />);
        const observer = getLoadAheadObserver();

        unmount();

        expect(observer.disconnect).toHaveBeenCalledOnce();
    });
});
