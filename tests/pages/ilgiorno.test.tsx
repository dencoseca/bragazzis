/** @vitest-environment happy-dom */

import { act, type ReactNode, type Ref } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { IlGiorno } from "@/pages/IlGiorno";

import { cleanupRenderedTrees, renderWithAct } from "../testUtils";

interface MockLayoutProps {
    children: ReactNode;
    scrollToTopBehavior?: ScrollBehavior;
    theme: string;
}

interface MockOptimizedImageProps {
    alt: string;
    className?: string;
    "data-size"?: number;
    loading?: "eager" | "lazy";
    pictureRef?: Ref<HTMLPictureElement>;
    shouldLoad?: boolean;
    sizes: string;
}

const galleryImages = vi.hoisted(() =>
    Array.from({ length: 12 }, (_, index) => ({
        alt: `gallery image ${index}`,
        image: {
            img: {
                h: 100,
                src: `/gallery-${index}.jpg`,
                w: 100,
            },
            sources: {},
        },
        size: 40,
    })),
);

vi.mock("@/components/layout/Layout", () => ({
    Layout({ children, scrollToTopBehavior, theme }: MockLayoutProps) {
        return (
            <main data-scroll-to-top-behavior={scrollToTopBehavior} data-theme={theme}>
                {children}
            </main>
        );
    },
}));

vi.mock("@/components/OptimizedImage", () => ({
    OptimizedImage({
        alt,
        className,
        "data-size": dataSize,
        loading,
        pictureRef,
        shouldLoad = true,
        sizes,
    }: MockOptimizedImageProps) {
        return (
            <picture
                className={className}
                data-alt={alt}
                data-loading={loading}
                data-should-load={String(shouldLoad)}
                data-size={dataSize}
                data-sizes={sizes}
                ref={pictureRef}
            >
                <img alt={alt} />
            </picture>
        );
    },
}));

vi.mock("@/data/galleryImages", () => ({
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

function removeIntersectionObserver() {
    Reflect.deleteProperty(window, "IntersectionObserver");
}

function getGalleryPictures() {
    return Array.from(document.querySelectorAll<HTMLPictureElement>(".ilgiorno__gallery .image"));
}

function getLoadStates() {
    return getGalleryPictures().map((picture) => ({
        loading: picture.dataset.loading,
        shouldLoad: picture.dataset.shouldLoad,
    }));
}

describe("IlGiorno gallery loading", () => {
    afterEach(async () => {
        removeIntersectionObserver();
        await cleanupRenderedTrees();
    });

    test("loads every gallery image when IntersectionObserver is unavailable", async () => {
        removeIntersectionObserver();

        await renderWithAct(<IlGiorno />);

        const pictures = getGalleryPictures();

        expect(pictures).toHaveLength(galleryImages.length);
        expect(getLoadStates()).toEqual(
            galleryImages.map(() => ({
                loading: "eager",
                shouldLoad: "true",
            })),
        );
    });

    test("starts with the initial eager set and loads ahead after intersection", async () => {
        installIntersectionObserverMock();

        await renderWithAct(<IlGiorno />);

        const observer = MockIntersectionObserver.instances[0];
        const initialPictures = getGalleryPictures();

        expect(observer).toBeDefined();
        expect(observer.rootMargin).toBe("1200px 0px");
        expect(observer.observedElements).toHaveLength(galleryImages.length);
        expect(getLoadStates()).toEqual([
            ...Array.from({ length: 8 }, () => ({
                loading: "eager",
                shouldLoad: "true",
            })),
            ...Array.from({ length: 4 }, () => ({
                loading: "lazy",
                shouldLoad: "false",
            })),
        ]);

        await act(async () => {
            observer.trigger(initialPictures[8], false);
        });

        expect(getLoadStates()[11]).toEqual({
            loading: "lazy",
            shouldLoad: "false",
        });

        await act(async () => {
            observer.trigger(initialPictures[8], true);
        });

        expect(getLoadStates()).toEqual(
            galleryImages.map(() => ({
                loading: "eager",
                shouldLoad: "true",
            })),
        );
    });
});
