import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import eggImg from '@/assets/images/egg.jpg'

interface FullWidthBannerProps {
  dimensions: { width: number; vh: number }
  breakpoints: { mobile: number; tablet: number }
}

export default function FullWidthBanner({
  dimensions: { width, vh },
  breakpoints: { mobile, tablet },
}: FullWidthBannerProps) {
  const { scrollYProgress } = useScroll()
  const textScrollLaptop = useTransform(
    scrollYProgress,
    [0.7, 1],
    [vh * -2, vh * 6],
  )
  const textScrollTablet = useTransform(
    scrollYProgress,
    [0.7, 1],
    [vh * -1, vh * 3],
  )
  const textScrollTranslateYValue =
    width >= tablet ? textScrollLaptop : width >= mobile ? textScrollTablet : 0

  return (
    <AnimatePresence>
      <section className="full-width-banner">
        <img
          className="full-width-banner__image"
          src={eggImg}
          alt="a gigantic italian chocolate easter egg"
          onContextMenu={(e) => e.preventDefault()}
        />
        <motion.article
          className="full-width-banner__text"
          style={{
            translateY: textScrollTranslateYValue,
            translateX: '-50%',
          }}
        >
          {width >= mobile ? (
            <>
              <span className="text--display">
                Each season brings a selection of
              </span>
              <span className="text--display">well considered products</span>
            </>
          ) : (
            <>
              <span className="text--display">Each season</span>
              <span className="text--display">brings a selection</span>
              <span className="text--display">of well considered</span>
              <span className="text--display">products</span>
            </>
          )}
        </motion.article>
      </section>
    </AnimatePresence>
  )
}
