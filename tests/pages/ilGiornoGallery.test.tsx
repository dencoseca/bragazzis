/** @vitest-environment happy-dom */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vite-plus/test";

import { IlGiornoGallery } from "@/pages/il-giorno/IlGiornoGallery";

const tokensScss = readFileSync(resolve(process.cwd(), "src/styles/_tokens.scss"), "utf8");

const galleryImages = vi.hoisted(() =>
    Array.from({ length: 12 }, (_, index) => ({
        alt: `gallery image ${index}`,
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
        size: 40,
    })),
);

vi.mock("@/pages/il-giorno/galleryImages", () => ({
    galleryImages,
}));

function getGalleryPictures() {
    return screen.getAllByRole("img").map((image) => {
        const picture = image.closest("picture");

        if (!picture) {
            throw new Error("Expected each gallery image to be wrapped in a picture");
        }

        return picture;
    });
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
    test("preserves captions, image ordering, and responsive sizes", () => {
        render(<IlGiornoGallery />);

        const gallery = screen.getByText("Aperto").parentElement;
        const pictures = getGalleryPictures();

        expect(gallery?.firstElementChild?.textContent).toBe("Aperto");
        expect(gallery?.lastElementChild?.textContent).toBe("Chiuso");
        expect(screen.getAllByRole("img").map((image) => image.getAttribute("alt"))).toEqual(
            galleryImages.map(({ alt }) => alt),
        );
        expect(screen.getAllByRole("img").map((image) => image.getAttribute("sizes"))).toEqual(
            galleryImages.map(() => `(max-width: ${getSassMobileBreakpoint()}) 100vw, 40vw`),
        );
        expect(pictures.map((picture) => picture.dataset.size)).toEqual(
            galleryImages.map(({ size }) => String(size)),
        );
    });

    test("prioritizes the first image and natively lazy loads the rest", () => {
        render(<IlGiornoGallery />);

        const images = screen.getAllByRole("img");

        expect(images[0].getAttribute("loading")).toBe("eager");
        expect(images[0].getAttribute("decoding")).toBe("sync");
        expect(images[0].getAttribute("fetchpriority")).toBe("high");
        expect(images.slice(1).map((image) => image.getAttribute("loading"))).toEqual(
            galleryImages.slice(1).map(() => "lazy"),
        );
        expect(images.slice(1).map((image) => image.getAttribute("decoding"))).toEqual(
            galleryImages.slice(1).map(() => "async"),
        );
        expect(images.map((image) => image.getAttribute("src"))).toEqual(
            galleryImages.map(({ image }) => image.img.src),
        );
        expect(
            getGalleryPictures().map((picture) => picture.querySelectorAll("source").length),
        ).toEqual(galleryImages.map(() => 1));
    });

    test("marks each image as loaded for its reveal animation", () => {
        render(<IlGiornoGallery />);

        const images = screen.getAllByRole("img");
        const pictures = getGalleryPictures();

        expect(pictures.map((picture) => picture.dataset.imageLoaded)).toEqual(
            galleryImages.map(() => "false"),
        );

        fireEvent.load(images[0]);

        expect(pictures[0].dataset.imageLoaded).toBe("true");
        expect(pictures.slice(1).map((picture) => picture.dataset.imageLoaded)).toEqual(
            galleryImages.slice(1).map(() => "false"),
        );
    });
});
