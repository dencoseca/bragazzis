import { PassThrough } from "node:stream";

import type { MouseEventHandler, Ref } from "react";
import { renderToPipeableStream, type PipeableStream } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vite-plus/test";

import { App } from "@/App";
import {
    getCanonicalUrl,
    getPageDocumentTitle,
    notFoundRoute,
    publicPageRoutes,
} from "@/constants/routes";
import { siteConfig } from "@/constants/siteConfig";

interface MockOptimizedImageProps {
    alt: string;
    className?: string;
    "data-size"?: number;
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
        "data-size": dataSize,
        onContextMenu,
        pictureRef,
    }: MockOptimizedImageProps) {
        return (
            <picture className={className} data-size={dataSize} ref={pictureRef}>
                <img
                    alt={alt}
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

vi.mock("@/assets/images/early-days.jpg?preset=editorial", () => ({
    default: {
        img: {
            h: 1,
            src: "/mock-image.jpg",
            w: 1,
        },
        sources: {},
    },
}));

vi.mock("@/assets/images/ticket-pisa.jpg?preset=editorial", () => ({
    default: {
        img: {
            h: 1,
            src: "/mock-image.jpg",
            w: 1,
        },
        sources: {},
    },
}));

vi.mock("@/assets/images/ticket-roma.jpg?preset=editorial", () => ({
    default: {
        img: {
            h: 1,
            src: "/mock-image.jpg",
            w: 1,
        },
        sources: {},
    },
}));

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
            size: 60,
        },
    ],
}));

interface RouteSmokeCase {
    canonicalUrl?: string;
    description: string;
    expectedTexts: string[];
    path: string;
    robots?: string;
    title: string;
}

const ROUTE_SMOKE_CASES: RouteSmokeCase[] = [
    {
        path: publicPageRoutes.home.path,
        canonicalUrl: getCanonicalUrl(publicPageRoutes.home.path),
        title: getPageDocumentTitle(publicPageRoutes.home.pageTitle),
        description: publicPageRoutes.home.description,
        expectedTexts: ["Roam freely and find inspiration", "Monday: 9:00 AM"],
    },
    {
        path: publicPageRoutes.laStoria.path,
        canonicalUrl: getCanonicalUrl(publicPageRoutes.laStoria.path),
        title: getPageDocumentTitle(publicPageRoutes.laStoria.pageTitle),
        description: publicPageRoutes.laStoria.description,
        expectedTexts: ["La Storia", "Bragazzi's opened in Sheffield in 2003"],
    },
    {
        path: publicPageRoutes.ilGiorno.path,
        canonicalUrl: getCanonicalUrl(publicPageRoutes.ilGiorno.path),
        title: getPageDocumentTitle(publicPageRoutes.ilGiorno.pageTitle),
        description: publicPageRoutes.ilGiorno.description,
        expectedTexts: ["IL GIORNO", "Aperto", "Chiuso"],
    },
    {
        path: "/missing-page",
        title: getPageDocumentTitle(notFoundRoute.pageTitle),
        description: notFoundRoute.description,
        robots: "noindex",
        expectedTexts: ["404", "This table's empty.", "Take me home"],
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

            if (route.canonicalUrl) {
                expect(markup).toContain(
                    `<link rel="canonical" href="${escapeHelmetValue(route.canonicalUrl)}"/>`,
                );
                expect(markup).toContain(
                    `<meta property="og:title" content="${escapeHelmetValue(route.title)}"/>`,
                );
                expect(markup).toContain(
                    `<meta property="og:description" content="${escapeHelmetValue(
                        route.description,
                    )}"/>`,
                );
                expect(markup).toContain(
                    `<meta property="og:url" content="${escapeHelmetValue(route.canonicalUrl)}"/>`,
                );
                expect(markup).toContain(`<meta property="og:type" content="website"/>`);
                expect(markup).toContain(
                    `<meta property="og:image" content="${escapeHelmetValue(
                        siteConfig.assets.ogImage,
                    )}"/>`,
                );
                expect(markup).toContain(`<meta name="twitter:card" content="summary"/>`);
                expect(markup).toContain(
                    `<meta name="twitter:title" content="${escapeHelmetValue(route.title)}"/>`,
                );
                expect(markup).toContain(
                    `<meta name="twitter:description" content="${escapeHelmetValue(
                        route.description,
                    )}"/>`,
                );
                expect(markup).toContain(`type="application/ld+json"`);
                expect(markup).toContain(`"@type":"LocalBusiness"`);
            }

            if (route.robots) {
                expect(markup).toContain(
                    `<meta name="robots" content="${escapeHelmetValue(route.robots)}"/>`,
                );
            }
        });
    }
});
