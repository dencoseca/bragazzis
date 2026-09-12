/** @vitest-environment happy-dom */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vite-plus/test";

import { OptimizedImage } from "@/components/OptimizedImage";
import type { OptimizedPicture } from "@/types/imagetools";

const image = {
    img: {
        h: 480,
        src: "/fallback.jpg",
        w: 640,
    },
    sources: {
        avif: "/image-640.avif 640w, /image-1280.avif 1280w",
        jpeg: "/image-640.jpg 640w, /image-1280.jpg 1280w",
    },
} satisfies OptimizedPicture;

describe("OptimizedImage", () => {
    test("renders responsive sources, dimensions and decoding hints", () => {
        const sizes = "(max-width: 768px) 100vw, 50vw";
        const { rerender } = render(
            <OptimizedImage image={image} alt="fresh pasta" sizes={sizes} />,
        );
        const img = screen.getByRole("img", { name: "fresh pasta" });
        const picture = img.closest("picture")!;
        expect(
            Array.from(picture.querySelectorAll("source"), (source) => ({
                type: source.type,
                srcset: source.srcset,
                sizes: source.sizes,
            })),
        ).toEqual([
            { type: "image/avif", srcset: image.sources.avif, sizes },
            { type: "image/jpeg", srcset: image.sources.jpeg, sizes },
        ]);
        expect(img.getAttribute("src")).toBe("/fallback.jpg");
        expect(img.getAttribute("width")).toBe("640");
        expect(img.getAttribute("height")).toBe("480");
        expect(img.getAttribute("sizes")).toBe(sizes);
        expect(img.getAttribute("decoding")).toBe("async");
        rerender(<OptimizedImage image={image} alt="fresh pasta" sizes={sizes} priority />);
        expect(img.getAttribute("decoding")).toBe("sync");
    });

    test("preserves dimensions with a local placeholder while deferred", () => {
        render(<OptimizedImage image={image} alt="fresh pasta" sizes="100vw" shouldLoad={false} />);
        const img = screen.getByRole("img");
        expect(img.closest("picture")?.querySelector("source")).toBeNull();
        expect(img.getAttribute("src")).toMatch(/^data:image\/svg\+xml,/);
        expect(img.getAttribute("width")).toBe("640");
        expect(img.getAttribute("height")).toBe("480");
        expect(img.getAttribute("decoding")).toBe("async");
    });

    test("forwards picture attributes", () => {
        render(
            <OptimizedImage
                image={image}
                alt="fresh pasta"
                sizes="60vw"
                className="gallery-image"
                data-size={60}
                aria-label="Gallery image"
            />,
        );
        const picture = screen.getByRole("img", { name: "fresh pasta" }).closest("picture");
        expect(picture?.classList.contains("gallery-image")).toBe(true);
        expect(picture?.getAttribute("data-size")).toBe("60");
        expect(picture?.getAttribute("aria-label")).toBe("Gallery image");
    });

    test("reveals a loaded image when the decode API is unavailable", async () => {
        render(<OptimizedImage image={image} alt="fresh pasta" sizes="100vw" revealOnLoad />);

        const renderedImage = screen.getByRole<HTMLImageElement>("img");
        const picture = renderedImage.closest("picture");
        Object.defineProperty(renderedImage, "decode", { value: undefined });

        expect(picture?.dataset.imageLoaded).toBe("false");

        fireEvent.load(renderedImage);

        await waitFor(() => expect(picture?.dataset.imageLoaded).toBe("true"));
    });

    test("waits for decoding before revealing the image and reporting it ready", async () => {
        let finishDecoding: (() => void) | undefined;
        const decoding = new Promise<void>((resolve) => {
            finishDecoding = resolve;
        });
        const onReady = vi.fn();

        render(
            <OptimizedImage
                image={image}
                alt="fresh pasta"
                sizes="100vw"
                revealOnLoad
                onReady={onReady}
            />,
        );

        const renderedImage = screen.getByRole<HTMLImageElement>("img");
        const picture = renderedImage.closest("picture");
        renderedImage.decode = vi.fn(() => decoding);

        fireEvent.load(renderedImage);

        expect(picture?.dataset.imageLoaded).toBe("false");
        expect(onReady).not.toHaveBeenCalled();

        finishDecoding?.();

        await waitFor(() => {
            expect(picture?.dataset.imageLoaded).toBe("true");
            expect(onReady).toHaveBeenCalledOnce();
        });
    });
    test("reports a successfully loaded image ready even when decode rejects", async () => {
        const onReady = vi.fn();
        render(
            <OptimizedImage
                image={image}
                alt="fresh pasta"
                sizes="100vw"
                revealOnLoad
                onReady={onReady}
            />,
        );
        const img = screen.getByRole<HTMLImageElement>("img");
        img.decode = vi.fn().mockRejectedValue(new Error("Decode unavailable"));
        fireEvent.load(img);
        await waitFor(() => expect(onReady).toHaveBeenCalledOnce());
        expect(img.closest("picture")?.dataset.imageLoaded).toBe("true");
        expect(img.closest("picture")?.dataset.imageError).toBeUndefined();
    });
});

describe("image eligibility and urgency", () => {
    // Literal expectations keep this table independent of the production branching.
    test.each([
        {
            shouldLoad: undefined,
            loading: undefined,
            priority: false,
            sources: 2,
            urgency: "lazy",
            fetchPriority: null,
        },
        {
            shouldLoad: undefined,
            loading: "lazy",
            priority: true,
            sources: 2,
            urgency: "eager",
            fetchPriority: "high",
        },
        {
            shouldLoad: undefined,
            loading: "eager",
            priority: false,
            sources: 2,
            urgency: "eager",
            fetchPriority: null,
        },
        {
            shouldLoad: undefined,
            loading: "eager",
            priority: true,
            sources: 2,
            urgency: "eager",
            fetchPriority: "high",
        },
        {
            shouldLoad: false,
            loading: "lazy",
            priority: false,
            sources: 0,
            urgency: "lazy",
            fetchPriority: null,
        },
        {
            shouldLoad: false,
            loading: "lazy",
            priority: true,
            sources: 0,
            urgency: "lazy",
            fetchPriority: null,
        },
        {
            shouldLoad: false,
            loading: "eager",
            priority: false,
            sources: 0,
            urgency: "lazy",
            fetchPriority: null,
        },
        {
            shouldLoad: false,
            loading: "eager",
            priority: true,
            sources: 0,
            urgency: "lazy",
            fetchPriority: null,
        },
        {
            shouldLoad: true,
            loading: "lazy",
            priority: false,
            sources: 2,
            urgency: "lazy",
            fetchPriority: null,
        },
        {
            shouldLoad: true,
            loading: "lazy",
            priority: true,
            sources: 2,
            urgency: "eager",
            fetchPriority: "high",
        },
        {
            shouldLoad: true,
            loading: "eager",
            priority: false,
            sources: 2,
            urgency: "eager",
            fetchPriority: null,
        },
        {
            shouldLoad: true,
            loading: "eager",
            priority: true,
            sources: 2,
            urgency: "eager",
            fetchPriority: "high",
        },
    ] as const)(
        "eligibility=$shouldLoad loading=$loading priority=$priority",
        ({ shouldLoad, loading, priority, sources, urgency, fetchPriority }) => {
            render(
                <OptimizedImage
                    image={image}
                    alt="fresh pasta"
                    sizes="100vw"
                    shouldLoad={shouldLoad}
                    loading={loading}
                    priority={priority}
                />,
            );
            const img = screen.getByRole("img");
            expect(img.closest("picture")?.querySelectorAll("source")).toHaveLength(sources);
            expect(img.getAttribute("src") === image.img.src).toBe(sources > 0);
            expect(img.getAttribute("loading")).toBe(urgency);
            expect(img.getAttribute("fetchpriority")).toBe(fetchPriority);
        },
    );

    test("replaces deferred sources without making an eligible image eager", async () => {
        const onReady = vi.fn();
        const { rerender } = render(
            <OptimizedImage
                image={image}
                alt="fresh pasta"
                sizes="100vw"
                shouldLoad={false}
                onReady={onReady}
            />,
        );
        fireEvent.load(screen.getByRole("img"));
        expect(onReady).not.toHaveBeenCalled();
        rerender(
            <OptimizedImage
                image={image}
                alt="fresh pasta"
                sizes="100vw"
                shouldLoad
                onReady={onReady}
            />,
        );
        expect(screen.getByRole("img").getAttribute("src")).toBe(image.img.src);
        expect(screen.getByRole("img").getAttribute("loading")).toBe("lazy");
        expect(screen.getByRole("img").closest("picture")?.querySelectorAll("source")).toHaveLength(
            2,
        );
        fireEvent.load(screen.getByRole("img"));
        await waitFor(() => expect(onReady).toHaveBeenCalledOnce());
    });

    test("reveals an accessible local fallback and reports errors without reporting readiness", () => {
        const onReady = vi.fn();
        const onError = vi.fn();
        render(
            <OptimizedImage
                image={image}
                alt="fresh pasta"
                sizes="100vw"
                revealOnLoad
                onReady={onReady}
                onError={onError}
            />,
        );
        fireEvent.error(screen.getByRole("img"));
        const fallback = screen.getByRole("img", { name: "Image unavailable: fresh pasta" });
        expect(fallback.closest("picture")?.dataset.imageError).toBe("true");
        expect(fallback.closest("picture")?.dataset.imageLoaded).toBe("false");
        expect(fallback.closest("picture")?.querySelector("source")).toBeNull();
        expect(decodeURIComponent(fallback.getAttribute("src") ?? "")).toContain(
            "Image unavailable</text>",
        );
        fireEvent.load(fallback);
        expect(onReady).not.toHaveBeenCalled();
        expect(onError).toHaveBeenCalledOnce();
    });
});
