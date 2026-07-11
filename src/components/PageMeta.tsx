import { getPageDocumentTitle } from "@/constants/routes";
import { localBusinessJsonLd, siteConfig } from "@/constants/siteConfig";

interface BasePageMetaProps {
    pageTitle: string;
    description: string;
}

interface PublicPageMetaProps extends BasePageMetaProps {
    canonicalUrl: string;
    noIndex?: never;
}

interface NoIndexPageMetaProps extends BasePageMetaProps {
    canonicalUrl?: never;
    noIndex: true;
}

type PageMetaProps = NoIndexPageMetaProps | PublicPageMetaProps;

export function PageMeta(props: PageMetaProps) {
    const { description, pageTitle } = props;
    const fullTitle = getPageDocumentTitle(pageTitle);

    if (props.noIndex) {
        return (
            <>
                <title>{fullTitle}</title>
                <meta name="description" content={description} />
                <meta name="robots" content="noindex" />
            </>
        );
    }

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={props.canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={props.canonicalUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:image" content={siteConfig.assets.ogImage} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <script type="application/ld+json">{JSON.stringify(localBusinessJsonLd)}</script>
        </>
    );
}
