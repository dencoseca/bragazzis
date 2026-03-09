import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import {
  motion,
  AnimatePresence,
  useTransform,
  useViewportScroll,
} from "framer-motion"
import { Link as ScrollToLink } from "react-scroll"

// Animations
const smoothTransition = {
  duration: 1.1,
  ease: [0.43, 0.13, 0.13, 0.96],
}

const contentVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      ...smoothTransition,
      delay: 1.5,
    },
  },
}

const downArrowVariants = {
  initial: {
    opacity: 0,
    translateX: "-50%",
  },
  animate: {
    opacity: [0, 1, 1],
    translateY: [-20, 0, 0],
    translateX: "-50%",
    transition: {
      ...smoothTransition,
      delay: 1.5,
      duration: 3,
      times: [0, 0.6, 1],
    },
  },
}

const titleVariants = {
  initial: {
    translateY: 400,
  },
  animate: {
    translateY: 0,
    transition: {
      ...smoothTransition,
      duration: 1.4,
      delay: 0.3,
    },
  },
}

function Cover({
  openingHours,
  dimensions: { width, vh },
  breakpoints: { mobile },
}) {
  // Set style controls for scroll animations
  const { scrollYProgress } = useViewportScroll()
  const heroImageScroll = useTransform(scrollYProgress, [0, 1], [0, vh * 59])

  return (
    <AnimatePresence>
      <div className="cover" id="cover">
        <div className="cover__title-wrapper">
          <motion.div
            className="cover__title text--page-title"
            variants={titleVariants}
            initial="initial"
            animate="animate"
          >
            BRAGAZZI'S
          </motion.div>
        </div>
        <div className="cover__image-wrapper">
          <motion.div
            className="cover__image-inner"
            style={{
              translateY: heroImageScroll,
            }}
            >
            <StaticImage
              className="cover__image"
              src="../images/parmesan.jpg"
              alt="a busy Italian cafe"
              layout="fullWidth"
              loading="eager"
              placeholder="#1d1d1d"
              onContextMenu={e => e.preventDefault()}
            />
          </motion.div>
        </div>
        <motion.div
          className="cover__content"
          variants={contentVariants}
          initial="initial"
          animate="animate"
        >
          <div className="opening-hours">
            {openingHours.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
          <div className="address">
            <a
              href="https://goo.gl/maps/n4uLGJGtaqSjSfoo6"
              target="_blank"
              rel="noreferrer"
            >
              <p>224-228 Abbeydale Road</p>
              <p>Sheffield</p>
            </a>
          </div>
        </motion.div>
        <ScrollToLink
          to={width >= mobile ? "statement" : "mobile-cover"}
          spy={true}
          smooth={true}
          duration={1000}
        >
          <motion.svg
            className="cover__down-arrow"
            variants={downArrowVariants}
            initial="initial"
            animate="animate"
            width="50"
            height="50"
            viewBox="0 0 50 50"
            fill="#f6f4f1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM23.5858 38.5858L17 32L18.4142 30.5858L24 36.1716V9H26V36.1716L31.5858 30.5858L33 32L26.4142 38.5858L26 39L25 40L24 39L23.5858 38.5858Z"
              fill="#f6f4f1"
            />
          </motion.svg>
        </ScrollToLink>
      </div>
    </AnimatePresence>
  )
}

export default Cover
