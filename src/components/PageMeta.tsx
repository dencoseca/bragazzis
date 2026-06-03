import { Helmet } from "react-helmet-async";

import { localBusinessJsonLd, siteConfig } from "@/constants/siteConfig";

interface PageMetaProps {
    pageTitle: string;
    description?: string;
    canonicalUrl?: string;
    includeLocalBusinessJsonLd?: boolean;
    includeOpenGraph?: boolean;
    includeTwitter?: boolean;
    robots?: string;
}

export function PageMeta({
    pageTitle,
    description = siteConfig.business.description,
    canonicalUrl,
    includeLocalBusinessJsonLd = false,
    includeOpenGraph = false,
    includeTwitter = false,
    robots,
}: PageMetaProps) {
    const fullTitle = pageTitle
        ? `${pageTitle} | ${siteConfig.business.name}`
        : siteConfig.business.name;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {robots && <meta name="robots" content={robots} />}
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
            {includeOpenGraph && <meta property="og:title" content={fullTitle} />}
            {includeOpenGraph && <meta property="og:description" content={description} />}
            {includeOpenGraph && canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            {includeOpenGraph && <meta property="og:type" content="website" />}
            {includeOpenGraph && <meta property="og:image" content={siteConfig.assets.ogImage} />}
            {includeTwitter && <meta name="twitter:card" content="summary" />}
            {includeTwitter && <meta name="twitter:title" content={fullTitle} />}
            {includeTwitter && <meta name="twitter:description" content={description} />}
            {includeLocalBusinessJsonLd && (
                <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
            )}
        </Helmet>
    );
}
