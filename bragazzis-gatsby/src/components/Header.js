import React from "react"
import { Link } from "gatsby"
import { motion, useAnimation } from "framer-motion"

// Animations
const smoothTransition = {
  duration: 0.6,
  ease: [0.43, 0.13, 0.13, 0.96],
}

const topLineVariants = {
  closed: {
    rotate: "0deg",
    translateY: 0,
  },
  open: {
    rotate: "45deg",
    translateY: 6,
  },
}

const bottomLineVariants = {
  closed: {
    rotate: "0deg",
    translateY: 0,
  },
  open: {
    rotate: "-45deg",
    translateY: -5,
  },
}

function Header({ location, menuIsOpen, setMenuIsOpen }) {
  // Grab page by location
  const pageIsLastoria = location.pathname.includes("/lastoria")
  // Setup style variables based on loaction
  const headerClassName = pageIsLastoria ? "header header--dark" : "header"
  const menuColor = pageIsLastoria && !menuIsOpen ? "#1d1d1d" : "#f6f4f1"
  const headerPosition = menuIsOpen ? "fixed" : "absolute"

  // Setup menu state animations
  const controls = useAnimation()

  function toggleMenu() {
    if (menuIsOpen) {
      setMenuIsOpen(false)
      controls.start("closed")
    }
    if (!menuIsOpen) {
      setMenuIsOpen(true)
      controls.start("open")
    }
  }

  return (
    <div
      className={headerClassName}
      id="header"
      style={{ position: headerPosition }}
    >
      <div className="header__tag">Purveyors of quality Italian goods</div>
      <div className="header__logo-wrapper">
        <Link to="/" aria-label="home">
          <svg
            width="100%"
            viewBox="0 0 50 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.87616 6.71764C9.79215 6.77367 9.89483 6.95102 10.2776 7.38043C10.5576 7.69779 10.875 8.1272 10.9777 8.33257C11.323 8.99533 11.3604 9.9568 11.295 15.8097L11.2297 21.3918H10.5576C8.94269 21.3918 6.60901 20.9064 5.40482 20.3183C4.37801 19.8143 3.82725 19.0395 3.64989 17.8166C3.61254 17.5739 3.54721 17.3592 3.50988 17.3312C3.36051 17.2379 2.65107 18.1807 2.24969 19.0115C1.7736 19.9916 1.59625 20.8504 1.68026 21.7652C1.80161 23.1468 2.3337 24.2389 3.48187 25.4991C4.17264 26.2646 4.17264 26.2646 4.09795 26.6566C3.97661 27.2727 4.02328 28.0382 4.20063 28.3929C4.36867 28.7196 4.8914 29.3263 5.01276 29.3263C5.04077 29.3263 5.09677 29.1583 5.13412 28.953C5.19945 28.5142 5.61019 28.0102 6.07692 27.7955C6.51566 27.5808 7.63582 27.3941 9.62413 27.198L11.2577 27.03L11.267 27.5434C11.323 30.6332 11.3044 40.0706 11.239 40.5654C11.1363 41.4242 10.9123 41.8909 10.2869 42.5723C9.99751 42.8804 9.76414 43.1791 9.76414 43.2351C9.76414 43.3565 34.9212 43.3565 37.0122 43.2351C40.7648 43.0017 43.4812 41.9469 45.6375 39.8839C46.8323 38.7358 47.6724 37.1955 48.1298 35.2912C48.4192 34.1151 48.4472 31.8654 48.1858 30.8666C47.5137 28.2995 45.7588 26.4139 42.557 24.8084C41.9783 24.519 41.5022 24.2669 41.5022 24.2483C41.5022 24.2296 41.8102 24.0336 42.1836 23.8189C43.6212 22.9694 45.1054 21.6532 45.8522 20.5517C46.8323 19.1235 47.2617 17.2939 47.0937 15.2683C46.9817 13.9987 46.7203 13.0186 46.1696 11.8984C44.9934 9.48073 43.0144 7.94984 40.0833 7.19374C38.151 6.69899 38.6738 6.70833 23.8129 6.67098C16.2144 6.65231 9.94147 6.68032 9.87613 6.71764H9.87616ZM35.1545 12.9066C37.7682 13.2613 38.6924 13.9707 39.0378 15.875C39.5232 18.5914 38.6177 20.197 36.1814 20.9438L35.4812 21.1585L27.4814 21.1865L19.4722 21.2145V12.8132L19.6869 12.7759C20.0883 12.6919 34.4544 12.8132 35.1545 12.9066ZM34.7625 27.4688C37.5255 27.7674 38.8978 28.4209 39.6165 29.7838C40.0646 30.6052 40.2233 31.436 40.1673 32.5935C40.1113 33.779 39.9432 34.3671 39.4205 35.1232C38.7857 36.0567 37.9456 36.5328 36.228 36.9061C35.5466 37.0555 34.8185 37.1022 32.4008 37.1675C28.9003 37.2609 19.7429 37.2889 19.5282 37.2049C19.3975 37.1582 19.3788 36.6261 19.3788 32.2575V27.3661H26.6132C31.1033 27.3661 34.2024 27.4034 34.7625 27.4688V27.4688Z"
              fill={menuColor}
            />
          </svg>
        </Link>
      </div>
      <nav className="header__nav">
        <Link className="header__link" to="/lastoria">
          La Storia
        </Link>
        <Link className="header__link" to="/ilgiorno">
          Il Giorno
        </Link>
      </nav>
      <div className="header__mobile-menu-button" onClick={() => toggleMenu()}>
        <motion.div
          className="line"
          initial="closed"
          animate={controls}
          variants={topLineVariants}
          transition={smoothTransition}
          style={{ backgroundColor: menuColor }}
        ></motion.div>
        <motion.div
          className="line"
          initial="closed"
          animate={controls}
          variants={bottomLineVariants}
          transition={smoothTransition}
          style={{ backgroundColor: menuColor }}
        ></motion.div>
      </div>
    </div>
  )
}

export default Header
