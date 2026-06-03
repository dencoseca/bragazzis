import { siteConfig } from "@/constants/siteConfig";

type PublicPageRoute = {
    path: string;
    label: string;
    pageTitle: string;
    description: string;
};

type MetadataRoute = Omit<PublicPageRoute, "label">;

export const publicPageRoutes = {
    home: {
        path: "/",
        label: "Il Caffè",
        pageTitle: "Home",
        description: "Bragazzi's — an Italian deli, café in Sheffield.",
    },
    laStoria: {
        path: "/lastoria",
        label: "La Storia",
        pageTitle: "La Storia",
        description:
            "La Storia — the story of Bragazzi's. Learn about our Italian roots and how we first started.",
    },
    ilGiorno: {
        path: "/ilgiorno",
        label: "Il Giorno",
        pageTitle: "Il Giorno",
        description: "Il Giorno — a day at Bragazzi's.",
    },
} as const satisfies Record<string, PublicPageRoute>;

export const notFoundRoute = {
    path: "*",
    pageTitle: "404 — Page Not Found",
    description: "Page not found.",
} as const satisfies MetadataRoute;

export const headerNavRoutes = [publicPageRoutes.laStoria, publicPageRoutes.ilGiorno] as const;

export const menuNavRoutes = [
    publicPageRoutes.home,
    publicPageRoutes.laStoria,
    publicPageRoutes.ilGiorno,
] as const;

export function getCanonicalUrl(path: string) {
    return `${siteConfig.business.origin}${path}`;
}

export function getPageDocumentTitle(pageTitle: string) {
    return pageTitle ? `${pageTitle} | ${siteConfig.business.name}` : siteConfig.business.name;
}
