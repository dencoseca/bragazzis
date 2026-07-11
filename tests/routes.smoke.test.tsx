/** @vitest-environment happy-dom */

import { act, useEffect, type Ref } from "react";
import { MemoryRouter, useNavigate, type NavigateFunction } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { App } from "@/App";
import {
    getCanonicalUrl,
    getPageDocumentTitle,
    notFoundRoute,
    publicPageRoutes,
} from "@/constants/routes";
import { localBusinessJsonLd, siteConfig } from "@/constants/siteConfig";

import { cleanupRenderedTrees, renderWithAct } from "./testUtils";

vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);

interface MockOptimizedImageProps {
    alt: string;
    className?: string;
    "data-size"?: number;
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
    OptimizedImage({ alt, className, "data-size": dataSize, pictureRef }: MockOptimizedImageProps) {
        return (
            <picture className={className} data-size={dataSize} ref={pictureRef}>
                <img
                    alt={alt}
                    decoding="async"
                    height="1"
                    loading="lazy"
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
        expectedTexts: ["404", "There's no more bread.", "I'll come back"],
    },
];

interface NavigationControllerProps {
    onReady: (navigate: NavigateFunction) => void;
}

function NavigationController({ onReady }: NavigationControllerProps) {
    const navigate = useNavigate();

    useEffect(() => {
        onReady(navigate);
    }, [navigate, onReady]);

    return <App />;
}

function expectSingleElement(selector: string): Element {
    const matches = document.head.querySelectorAll(selector);

    expect(matches).toHaveLength(1);

    return matches[0];
}

function expectPublicPageMetadata(route: RouteSmokeCase) {
    if (!route.canonicalUrl) {
        throw new Error(`Expected ${route.path} to have a canonical URL`);
    }

    expect(expectSingleElement('meta[name="description"]').getAttribute("content")).toBe(
        route.description,
    );
    expect(expectSingleElement('link[rel="canonical"]').getAttribute("href")).toBe(
        route.canonicalUrl,
    );
    expect(expectSingleElement('meta[property="og:title"]').getAttribute("content")).toBe(
        route.title,
    );
    expect(expectSingleElement('meta[property="og:description"]').getAttribute("content")).toBe(
        route.description,
    );
    expect(expectSingleElement('meta[property="og:url"]').getAttribute("content")).toBe(
        route.canonicalUrl,
    );
    expect(expectSingleElement('meta[property="og:type"]').getAttribute("content")).toBe("website");
    expect(expectSingleElement('meta[property="og:image"]').getAttribute("content")).toBe(
        siteConfig.assets.ogImage,
    );
    expect(expectSingleElement('meta[name="twitter:card"]').getAttribute("content")).toBe(
        "summary",
    );
    expect(expectSingleElement('meta[name="twitter:title"]').getAttribute("content")).toBe(
        route.title,
    );
    expect(expectSingleElement('meta[name="twitter:description"]').getAttribute("content")).toBe(
        route.description,
    );
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');

    expect(structuredDataScripts).toHaveLength(1);
    expect(JSON.parse(structuredDataScripts[0].textContent ?? "")).toEqual(localBusinessJsonLd);
    expect(document.head.querySelectorAll('meta[name="robots"]')).toHaveLength(0);
}

function expectNoIndexMetadata(route: RouteSmokeCase) {
    expect(expectSingleElement('meta[name="description"]').getAttribute("content")).toBe(
        route.description,
    );
    expect(expectSingleElement('meta[name="robots"]').getAttribute("content")).toBe("noindex");
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(0);
    expect(document.head.querySelectorAll('meta[property^="og:"]')).toHaveLength(0);
    expect(document.head.querySelectorAll('meta[name^="twitter:"]')).toHaveLength(0);
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
}

describe("core route smoke tests", () => {
    afterEach(async () => {
        await cleanupRenderedTrees();
    });

    test("renders route content and keeps document metadata current across navigation", async () => {
        let navigate: NavigateFunction | undefined;
        const handleNavigationReady = (readyNavigate: NavigateFunction) => {
            navigate = readyNavigate;
        };
        const container = await renderWithAct(
            <MemoryRouter initialEntries={[ROUTE_SMOKE_CASES[0].path]}>
                <NavigationController onReady={handleNavigationReady} />
            </MemoryRouter>,
        );
        const navigationCases = [...ROUTE_SMOKE_CASES, ROUTE_SMOKE_CASES[0]];

        for (const route of navigationCases) {
            const navigateTo = navigate;

            if (!navigateTo) {
                throw new Error("Expected client-side navigation to be ready");
            }

            await act(async () => {
                await navigateTo(route.path);
            });

            await vi.waitFor(() => {
                expect(document.title).toBe(route.title);

                for (const expectedText of route.expectedTexts) {
                    expect(container.textContent).toContain(expectedText);
                }
            });

            if (route.canonicalUrl) {
                expectPublicPageMetadata(route);
            } else {
                expectNoIndexMetadata(route);
            }
        }
    });
});
