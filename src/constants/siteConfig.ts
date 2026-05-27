type ExternalLink = {
    label: string;
    url: string;
};

type OpeningHoursSpecification = {
    "@type": "OpeningHoursSpecification";
    dayOfWeek: string[];
    opens: string;
    closes: string;
};

const SITE_ORIGIN = "https://bragazzis.co.uk";

export const siteConfig = {
    business: {
        name: "Bragazzi's",
        legalName: "Bragazzi's Ltd",
        description:
            "An Italian deli, café in Sheffield, serving authentic Italian food and coffee.",
        origin: SITE_ORIGIN,
        localBusinessId: `${SITE_ORIGIN}/#localbusiness`,
        email: "info@bragazzis.co.uk",
        phone: {
            display: "0114 258 1483",
            href: "tel:+441142581483",
            international: "+44 114 258 1483",
        },
        address: {
            streetAddress: "224-228 Abbeydale Road",
            addressLocality: "Sheffield",
            addressRegion: "South Yorkshire",
            postalCode: "S7 1FL",
            addressCountry: "GB",
            mapsUrl: "https://goo.gl/maps/n4uLGJGtaqSjSfoo6",
        },
    },
    assets: {
        ogImage: `${SITE_ORIGIN}/og-image.png`,
        logo: `${SITE_ORIGIN}/favicon.svg`,
    },
    openingHours: {
        display: [
            "Monday: 9:00 AM – 3:00 PM",
            "Tuesday: 9:00 AM – 3:00 PM",
            "Wednesday: 9:00 AM – 3:00 PM",
            "Thursday: 9:00 AM – 3:00 PM",
            "Friday: 9:00 AM – 4:15 PM",
            "Saturday: 9:00 AM – 4:15 PM",
            "Sunday: Closed",
        ],
        schema: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
                opens: "09:00",
                closes: "15:00",
            },
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Friday", "Saturday"],
                opens: "09:00",
                closes: "16:15",
            },
        ] satisfies OpeningHoursSpecification[],
    },
    links: {
        social: [
            {
                label: "Facebook",
                url: "https://www.facebook.com/bragazzis/",
            },
            {
                label: "Instagram",
                url: "https://www.instagram.com/bragazzis/",
            },
            {
                label: "TripAdvisor",
                url: "https://www.tripadvisor.co.uk/Restaurant_Review-g186364-d3435970-Reviews-Bragazzis-Sheffield_South_Yorkshire_England.html",
            },
        ] satisfies ExternalLink[],
        photographyCredits: [
            {
                label: "Maytree",
                url: "https://www.maytreephotography.co.uk",
            },
            {
                label: "Ellie Grace Photography",
                url: "https://www.elliegracephotography.co.uk/",
            },
        ] satisfies ExternalLink[],
    },
    credits: {
        siteBy: "Leon Brown",
        copyrightStartYear: 2021,
    },
} as const;

export const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": siteConfig.business.localBusinessId,
    name: siteConfig.business.name,
    description: siteConfig.business.description,
    url: siteConfig.business.origin,
    telephone: siteConfig.business.phone.international,
    address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.business.address.streetAddress,
        addressLocality: siteConfig.business.address.addressLocality,
        addressRegion: siteConfig.business.address.addressRegion,
        postalCode: siteConfig.business.address.postalCode,
        addressCountry: siteConfig.business.address.addressCountry,
    },
    image: siteConfig.assets.ogImage,
    logo: siteConfig.assets.logo,
    openingHoursSpecification: siteConfig.openingHours.schema,
    sameAs: siteConfig.links.social.map((link) => link.url),
} as const;
