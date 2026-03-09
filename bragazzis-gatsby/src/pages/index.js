import React, { useEffect, useState } from "react"
import { graphql } from "gatsby"

// Utils
import debounce from "../utils/debounce"

// Components
import Cover from "../components/Cover"
import FloatingItems from "../components/FloatingItems"
import FullWidthBanner from "../components/FullWidthBanner"
import Layout from "../components/Layout"

function Home({ data, location }) {
  // Extract opening hours from gatsby-source-google-places query
  const openingHours =
    data.allGooglePlacesPlace.edges[0].node.opening_hours.weekday_text
  // Setup breakpoints and dimensions for responsive layout
  const breakpoints = {
    mobile: 760,
    tablet: 1080,
  }
  const [dimensions, setDimensions] = useState({
    height: 1200,
    width: 1980,
    vh: 100,
    vw: 100,
  })

  useEffect(() => {
    // Prevent flashing
    document.querySelector("main").classList.add("visible")

    // Set initial values as soon as page loads to prevent a null value on initial hydration
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth,
      vh: window.innerHeight / 100,
      vw: window.innerWidth / 100,
    })
  }, [])

  // Reset window size variables as browser gets resized
  useEffect(() => {
    // Grab inner height of window
    let vh = dimensions.height * 0.01
    // Set css variable vh
    document.documentElement.style.setProperty("--vh", `${vh}px`)

    // Only debounce / resize on tablet and larger
    if (dimensions.width >= breakpoints.mobile) {
      const debouncedHandleResize = debounce(function handleResize() {
        setDimensions({
          height: window.innerHeight,
          width: window.innerWidth,
          vh: window.innerHeight / 100,
          vw: window.innerWidth / 100,
        })
      }, 1000)

      window.addEventListener("resize", debouncedHandleResize)

      return () => {
        window.removeEventListener("resize", debouncedHandleResize)
      }
    }
  }, [dimensions, breakpoints.mobile])

  return (
    <Layout pageTitle="Home" location={location}>
      <Cover
        openingHours={openingHours}
        dimensions={dimensions}
        breakpoints={breakpoints}
      />
      <section className="home__mobile-cover" id="mobile-cover">
        <div>
          {openingHours.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      </section>
      <section className="home__statement text--display" id="statement">
        <span>Roam freely and find inspiration...</span>
        <span>or that obscure pasta shape that you've</span>
        <span>been looking for</span>
      </section>
      <FloatingItems dimensions={dimensions} breakpoints={breakpoints} />
      <FullWidthBanner dimensions={dimensions} breakpoints={breakpoints} />
      <section className="home__covid-notice">
        <span className="text--display">Covid Restrictions</span>
        <p className="text--md">
          We want to reassure you that we are putting all measures in place to
          keep you and our team safe so that you can confidently enjoy your
          visit.
        </p>
        <p className="text--md">
          We are following all government guidelines and working on practice
          measures within the shop. We have completed necessary risk assessments
          and all procedures which will be constantly reviewed and updated where
          necessary in line with government guidelines.
        </p>
        <p className="text--md">
          We ask you to please use common sense to play your part keeping
          everyone safe. In return we will be doing the same for you.
        </p>
        <p className="text--md">
          Due to the constantly changing nature of this guidance, we will be
          continuously reviewing our procedures related to capacity.
        </p>
      </section>
    </Layout>
  )
}

export default Home

// Setup gatsby-source-google-places query
export const query = graphql`
  query {
    allGooglePlacesPlace {
      edges {
        node {
          opening_hours {
            weekday_text
          }
        }
      }
    }
  }
`
