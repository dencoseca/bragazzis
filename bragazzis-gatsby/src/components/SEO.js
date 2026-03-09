import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useLocation } from "@reach/router"
import { useStaticQuery, graphql } from "gatsby"

// Setup query for site metadata
const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        titleTemplate
        defaultDescription: description
        siteUrl
        defaultImage: image
        logo
      }
    }
  }
`

function SEO({ title, description, image, article }) {
  // Grab site metadata from Gatsby config and current page
  const { pathname } = useLocation()
  const { site } = useStaticQuery(query)

  const {
    defaultTitle,
    titleTemplate,
    defaultDescription,
    siteUrl,
    defaultImage,
    logo,
  } = site.siteMetadata

  // Create SEO object based on whether required data exists
  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}/${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
    logo,
  }

  // Setup JSON-LD
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${seo.url}#CafeOrCoffeeShop`,
    url: seo.url,
    mainEntityOfPage: seo.url,
    description: seo.description,
    headline: "Alimentari e caffè di qualità.",
    name: seo.title,
    image: seo.image,
    priceRange: "£5-15",
    telephone: "+0114 258 1483",
    email: "info@bragazzis.co.uk",
    address: {
      "@type": "PostalAddress",
      name: "Bragazzi's Cafe",
      streetAddress: "224-228 Abbeydale Road",
      addressLocality: "Sheffield",
      postalCode: "S7 1FL",
      addressCountry: "UK",
      "@id": `${seo.url}#PostalAddress`,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 53.3627282,
      longitude: -1.4779884,
      "@id": `${seo.url}#GeoCoordinates`,
    },
    servesCuisine: "Italian",
    acceptsReservations: "false",
    legalName: "Bragazzi's Ltd",
    logo: seo.logo,
    foundingDate: "2003",
    foundingLocation: "Sheffield",
    founders: [
      {
        "@type": "Person",
        name: "Matteo Bragazzi",
      },
    ],
    sameAs: [
      "https://www.facebook.com/bragazzis",
      "https://www.instagram.com/bragazzis",
    ],
    inLanguage: "en-UK",
    petsAllowed: "No",
  }

  return (
    <Helmet
      title={seo.title}
      titleTemplate={titleTemplate}
      htmlAttributes={{
        lang: "en",
      }}
    >
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      {seo.url && <meta property="og:url" content={seo.url} />}
      {(article ? true : null) && <meta property="og:type" content="article" />}
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
      {seo.image && <meta property="og:image" content={seo.image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {seo.title && <meta name="twitter:title" content={seo.title} />}
      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}
    </Helmet>
  )
}

export default SEO

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool,
}

SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  article: false,
}
