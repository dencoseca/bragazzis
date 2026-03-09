import React, { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"

// Components
import Footer from "./Footer"
import Header from "./Header"
import SEO from "./SEO"
import Menu from "./Menu"

function Layout({ children, pageTitle, location }) {
  // Grab location from pathname
  const isPageIlgiorno = location.pathname.includes("/ilgiorno")
  // Setup style variables based on location
  const mainBackgroundColor = isPageIlgiorno ? "#1d1d1d" : "#fff"

  // Menu state
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  // Prevent flashing
  useEffect(() => {
    document.querySelector("main").classList.add("visible")
  }, [])

  return (
    <>
      <SEO title={pageTitle} />
      <AnimatePresence>{menuIsOpen && <Menu />}</AnimatePresence>
      <main
        style={{
          backgroundColor: mainBackgroundColor,
        }}
      >
        <Header
          location={location}
          menuIsOpen={menuIsOpen}
          setMenuIsOpen={setMenuIsOpen}
        />
        {children}
        <Footer location={location} />
      </main>
    </>
  )
}

export default Layout
