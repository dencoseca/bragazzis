// Set correct environment variables
require('dotenv').config({
	path: `.env.${process.env.NODE_ENV}`,
})

// Setup variables for ingoring Netlify deploy previews in gatsby-plugin-robots-txt
const {
	NODE_ENV,
	URL: NETLIFY_SITE_URL = 'https://www.bragazzis.co.uk',
	DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
	CONTEXT: NETLIFY_ENV = NODE_ENV,
} = process.env
const isNetlifyProduction = NETLIFY_ENV === 'production'
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL

// Configure plugins
module.exports = {
	siteMetadata: {
		title: `Bragazzis`,
		titleTemplate: `Bragazzi's | %s`,
		description: `Purveyors of quality Italian goods. We are a cafe, shop and delicatessen.`,
		siteUrl,
		author: `Leon Brown`,
		image: `src/images/cafe-view-SEO.jpg`,
		logo: `src/images/logo.png`,
	},
	plugins: [
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Bragazzi's`,
				short_name: `Bragazzi's`,
				description: `Purveyors of quality Italian goods. We are a cafe, shop and delicatessen.`,
				start_url: `/`,
				background_color: `#f6f4f1`,
				theme_color: `#1d1d1d`,
				display: `standalone`,
				icon: `src/images/logo.png`,
				icon_options: {
					purpose: `any maskable`,
				},
				lang: 'en',
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images/`,
			},
		},
		`gatsby-plugin-sass`,
		`gatsby-plugin-image`,
		`gatsby-plugin-sharp`,
		`gatsby-transformer-sharp`,
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-source-google-places`,
			options: {
				placeIds: ['ChIJXQTkrGGCeUgRSaL1gEOk_MY'],
				apiKey: `${process.env.PLACES_API_KEY}`,
				language: 'en-US', // optional, defaults to en-US
			},
		},
		`gatsby-plugin-sitemap`,
		{
			resolve: `gatsby-plugin-robots-txt`,
			options: {
				resolveEnv: () => NETLIFY_ENV,
				env: {
					production: {
						policy: [{ userAgent: `*` }],
					},
					'branch-deploy': {
						policy: [{ userAgent: `*`, disallow: [`/`] }],
						sitemap: null,
						host: null,
					},
					'deploy-preview': {
						policy: [{ userAgent: `*`, disallow: [`/`] }],
						sitemap: null,
						host: null,
					},
				},
			},
		},
	],
}
