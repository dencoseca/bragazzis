/** @vitest-environment happy-dom */

import { fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vite-plus/test";

import { OptimizedImage } from "@/components/OptimizedImage";
import type { OptimizedPicture } from "@/types/imagetools";

const image = {
    img: {
        h: 480,
        src: "/fallback.jpg",
        w: 640,
    },
    sources: {
        "image/avif": "/image-640.avif 640w, /image-1280.avif 1280w",
        "image/jpeg": "/image-640.jpg 640w, /image-1280.jpg 1280w",
    },
} satisfies OptimizedPicture;

describe("OptimizedImage", () => {
    test("renders responsive sources and priority loading hints", () => {
        const markup = renderToStaticMarkup(
            <OptimizedImage
                image={image}
                alt="fresh pasta"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
            />,
        );

        expect(markup).toContain("<picture");
        expect(markup).toContain('type="image/avif"');
        expect(markup).toContain('type="image/jpeg"');
        expect(markup).toContain('sizes="(max-width: 768px) 100vw, 50vw"');
        expect(markup).toContain('src="/fallback.jpg"');
        expect(markup).toContain('alt="fresh pasta"');
        expect(markup).toContain('loading="eager"');
        expect(markup).toContain('decoding="sync"');
        expect(markup).toContain('fetchPriority="high"');
    });

    test("uses native lazy loading by default", () => {
        const markup = renderToStaticMarkup(
            <OptimizedImage image={image} alt="fresh pasta" sizes="100vw" />,
        );

        expect(markup).toContain("<source");
        expect(markup).toContain('src="/fallback.jpg"');
        expect(markup).toContain('width="640"');
        expect(markup).toContain('height="480"');
        expect(markup).toContain('loading="lazy"');
        expect(markup).toContain('decoding="async"');
        expect(markup).not.toContain("fetchPriority");
    });

    test("uses an intrinsic-size placeholder while deferred", () => {
        const markup = renderToStaticMarkup(
            <OptimizedImage image={image} alt="fresh pasta" sizes="100vw" shouldLoad={false} />,
        );

        expect(markup).not.toContain("<source");
        expect(markup).toContain("data:image/svg+xml");
        expect(markup).toContain("width%3D%22640%22");
        expect(markup).toContain("height%3D%22480%22");
        expect(markup).toContain('loading="lazy"');
        expect(markup).toContain('decoding="async"');
        expect(markup).not.toContain("fetchPriority");
    });

    test("forwards picture attributes", () => {
        const markup = renderToStaticMarkup(
            <OptimizedImage
                image={image}
                alt="fresh pasta"
                sizes="60vw"
                className="gallery-image"
                data-size={60}
                aria-label="Gallery image"
            />,
        );

        expect(markup).toContain(
            '<picture class="gallery-image" data-size="60" aria-label="Gallery image">',
        );
        expect(markup).toContain('src="/fallback.jpg"');
        expect(markup).toContain('loading="lazy"');
        expect(markup).toContain('decoding="async"');
        expect(markup).not.toContain("fetchPriority");
    });

    test("marks a revealed image as loaded after its load event", () => {
        render(<OptimizedImage image={image} alt="fresh pasta" sizes="100vw" revealOnLoad />);

        const renderedImage = screen.getByRole("img");
        const picture = renderedImage.closest("picture");

        expect(picture?.dataset.imageLoaded).toBe("false");

        fireEvent.load(renderedImage);

        expect(picture?.dataset.imageLoaded).toBe("true");
    });
});
