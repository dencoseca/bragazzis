/** @vitest-environment happy-dom */

import { act, render } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";

import type { OptimizedImageProps } from "@/components/OptimizedImage";
import { IlGiornoGallery } from "@/pages/il-giorno/IlGiornoGallery";

const { renders } = vi.hoisted(() => ({ renders: new Map<string, number>() }));

vi.mock("@/hooks/useReveal", () => ({ useReveal: () => undefined }));
vi.mock("@/pages/il-giorno/galleryImages", () => ({
    galleryImages: Array.from({ length: 8 }, (_, index) => ({
        filename: `${index}.jpg`,
        alt: `Gallery image ${index}`,
        placement: "full",
        image: {
            img: { src: `/${index}.jpg`, w: 1500, h: 1000 },
            sources: { avif: `/${index}.avif 1500w` },
        },
    })),
}));
vi.mock("@/components/OptimizedImage", async (importOriginal) => {
    const { OptimizedImage } = await importOriginal<typeof import("@/components/OptimizedImage")>();
    return {
        OptimizedImage(props: OptimizedImageProps) {
            renders.set(props.alt, (renders.get(props.alt) ?? 0) + 1);
            return <OptimizedImage {...props} />;
        },
    };
});

afterEach(() => {
    vi.unstubAllGlobals();
    renders.clear();
});

function installObserver() {
    let callback: IntersectionObserverCallback;
    const observe = vi.fn();
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal(
        "IntersectionObserver",
        class {
            constructor(onEntries: IntersectionObserverCallback) {
                callback = onEntries;
            }
            observe = observe;
            unobserve = unobserve;
            disconnect = disconnect;
        },
    );

    return {
        observe,
        unobserve,
        disconnect,
        notify(entries: { target: Element; isIntersecting: boolean }[]) {
            act(() => {
                callback(
                    entries as IntersectionObserverEntry[],
                    {
                        unobserve,
                    } as unknown as IntersectionObserver,
                );
            });
        },
    };
}

function eligibleIndices(container: HTMLElement) {
    return Array.from(container.querySelectorAll("picture"))
        .filter((picture) => picture.querySelector("source"))
        .map((picture) => Number(picture.getAttribute("data-gallery-index")));
}

test("loads ahead to the furthest intersecting image, keeps eligibility on reverse scroll, and cleans up", () => {
    const observer = installObserver();
    const { container, unmount } = render(<IlGiornoGallery />);
    const pictures = container.querySelectorAll("picture");

    expect(eligibleIndices(container)).toEqual([0, 1]);
    expect(observer.observe).toHaveBeenCalledTimes(8);
    expect(pictures[0].querySelector("img")?.getAttribute("fetchpriority")).toBe("high");

    observer.notify([
        { target: pictures[0], isIntersecting: true },
        { target: pictures[2], isIntersecting: true },
        { target: pictures[7], isIntersecting: false },
    ]);
    expect(eligibleIndices(container)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(observer.unobserve.mock.calls.map(([target]) => target)).toEqual([
        pictures[0],
        pictures[2],
    ]);
    // Previously eligible and still ineligible pictures do not re-render as the boundary moves.
    expect(renders.get("Gallery image 0")).toBe(1);
    expect(renders.get("Gallery image 4")).toBe(2);
    expect(renders.get("Gallery image 7")).toBe(1);

    observer.notify([{ target: pictures[1], isIntersecting: true }]);
    expect(eligibleIndices(container)).toEqual([0, 1, 2, 3, 4, 5]);

    observer.notify([{ target: pictures[7], isIntersecting: true }]);
    expect(eligibleIndices(container)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(
        Array.from(pictures).every((picture) => picture.querySelector("img")?.loading === "eager"),
    ).toBe(true);

    unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
});

test("loads every image when IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    Reflect.deleteProperty(window, "IntersectionObserver");
    const { container } = render(<IlGiornoGallery />);
    expect(eligibleIndices(container)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
});
