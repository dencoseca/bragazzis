import { PassThrough } from "node:stream";

import type { MouseEventHandler, Ref } from "react";
import { renderToPipeableStream, type PipeableStream } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vite-plus/test";

import { App } from "@/App";
import { siteConfig } from "@/constants/siteConfig";

interface MockOptimizedImageProps {
    alt: string;
    className?: string;
    imgClassName?: string;
    onContextMenu?: MouseEventHandler<HTMLImageElement>;
    pictureRef?: Ref<HTMLPictureElement>;
}

// Keep route smoke tests focused on routing, content, and metadata without
// forcing CI to transform every responsive image variant.
vi.mock("@/components/Cover", () => ({
    Cover() {
        return null;
    },
}));

vi.mock("@/components/FloatingItems", () => ({
    FloatingItems() {
        return null;
    },
}));

vi.mock("@/components/FullWidthBanner", () => ({
    FullWidthBanner() {
        return null;
    },
}));

vi.mock("@/components/OptimizedImage", () => ({
    OptimizedImage({
        alt,
        className,
        imgClassName,
        onContextMenu,
        pictureRef,
    }: MockOptimizedImageProps) {
        return (
            <picture className={className} ref={pictureRef}>
                <img
                    alt={alt}
                    className={imgClassName}
                    decoding="async"
                    height="1"
                    loading="lazy"
                    onContextMenu={onContextMenu}
                    src="/mock-image.jpg"
                    width="1"
                />
            </picture>
        );
    },
}));

vi.mock(
    "@/assets/images/early-days.jpg?w=360;540;720;960;1200&format=avif;webp;jpg&as=picture",
    () => ({
        default: {
            img: {
                h: 1,
                src: "/mock-image.jpg",
                w: 1,
            },
            sources: {},
        },
    }),
);

vi.mock(
    "@/assets/images/ticket-pisa.jpg?w=360;540;720;960;1200&format=avif;webp;jpg&as=picture",
    () => ({
        default: {
            img: {
                h: 1,
                src: "/mock-image.jpg",
                w: 1,
            },
            sources: {},
        },
    }),
);

vi.mock(
    "@/assets/images/ticket-roma.jpg?w=360;540;720;960;1200&format=avif;webp;jpg&as=picture",
    () => ({
        default: {
            img: {
                h: 1,
                src: "/mock-image.jpg",
                w: 1,
            },
            sources: {},
        },
    }),
);

vi.mock("@/data/galleryImages", () => ({
    galleryImages: [
        {
            alt: "sandwich board sign outside cafe",
            image: {
                img: {
                    h: 1,
                    src: "/mock-image.jpg",
                    w: 1,
                },
                sources: {},
            },
            sizeClass: "image--60",
        },
    ],
}));

interface RouteSmokeCase {
    description: string;
    expectedTexts: string[];
    path: string;
    title: string;
}

const ROUTE_SMOKE_CASES: RouteSmokeCase[] = [
    {
        path: "/",
        title: `Home | ${siteConfig.business.name}`,
        description: "Bragazzi's — an Italian deli, café in Sheffield.",
        expectedTexts: ["Roam freely and find inspiration", "Monday: 9:00 AM"],
    },
    {
        path: "/lastoria",
        title: `La Storia | ${siteConfig.business.name}`,
        description:
            "La Storia — the story of Bragazzi's. Learn about our Italian roots and how we first started.",
        expectedTexts: ["La Storia", "Bragazzi's opened in Sheffield in 2003"],
    },
    {
        path: "/ilgiorno",
        title: `Il Giorno | ${siteConfig.business.name}`,
        description: "Il Giorno — a day at Bragazzi's.",
        expectedTexts: ["IL GIORNO", "Aperto", "Chiuso"],
    },
    {
        path: "/missing-page",
        title: `404 — Page Not Found | ${siteConfig.business.name}`,
        description: "Page not found.",
        expectedTexts: ["404", "Page not found", "Back to Home"],
    },
];

function escapeHelmetValue(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}

async function renderRoute(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        const stream = new PassThrough();
        let renderer: PipeableStream | undefined;
        let hasSettled = false;

        const timeout = setTimeout(() => {
            renderer?.abort(new Error(`Timed out rendering ${path}`));
        }, 5000);

        const fail = (error: unknown) => {
            if (hasSettled) return;

            hasSettled = true;
            clearTimeout(timeout);
            reject(error instanceof Error ? error : new Error(String(error)));
        };

        stream.on("data", (chunk: Buffer) => {
            chunks.push(chunk);
        });
        stream.on("error", fail);
        stream.on("end", () => {
            if (hasSettled) return;

            hasSettled = true;
            clearTimeout(timeout);
            resolve(Buffer.concat(chunks).toString("utf8"));
        });

        renderer = renderToPipeableStream(
            <MemoryRouter initialEntries={[path]}>
                <App />
            </MemoryRouter>,
            {
                onAllReady() {
                    renderer?.pipe(stream);
                },
                onError(error) {
                    fail(error);
                },
                onShellError(error) {
                    fail(error);
                },
            },
        );
    });
}

describe("core route smoke tests", () => {
    for (const route of ROUTE_SMOKE_CASES) {
        test(`${route.path} renders expected content and metadata`, async () => {
            const markup = await renderRoute(route.path);

            for (const expectedText of route.expectedTexts) {
                expect(markup).toContain(escapeHelmetValue(expectedText));
            }

            expect(markup).toContain(`<title>${escapeHelmetValue(route.title)}</title>`);
            expect(markup).toContain(
                `<meta name="description" content="${escapeHelmetValue(route.description)}"/>`,
            );
        });
    }
});
