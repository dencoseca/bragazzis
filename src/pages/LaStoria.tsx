import { motion, AnimatePresence } from 'motion/react'
import Layout from '@/components/Layout'
import ticketRomaImg from '@/assets/images/ticket-roma.jpg'
import ticketPisaImg from '@/assets/images/ticket-pisa.jpg'
import earlyDaysImg from '@/assets/images/early-days.jpg'

const smoothTransition = {
  duration: 1.1,
  ease: [0.43, 0.13, 0.13, 0.96] as [number, number, number, number],
  delay: 0.3,
}

const leftTicketVariants = {
  initial: {
    translateY: 300,
    translateX: -500,
    rotate: '-25deg',
  },
  animate: {
    translateY: 0,
    translateX: 0,
    rotate: '-25deg',
    transition: {
      ...smoothTransition,
    },
  },
}

const rightTicketVariants = {
  initial: {
    translateY: 300,
    translateX: 500,
    rotate: '25deg',
  },
  animate: {
    translateY: 0,
    translateX: 0,
    rotate: '25deg',
    transition: {
      ...smoothTransition,
    },
  },
}

export default function LaStoria() {
  return (
    <Layout pageTitle="La Storia">
      <AnimatePresence>
        <div className="lastoria">
          <div className="lastoria__title-wrapper">
            <div className="lastoria__title text--page-title">La Storia</div>
            <motion.div
              className="ticket left"
              initial="initial"
              animate="animate"
              variants={leftTicketVariants}
            >
              <img src={ticketRomaImg} alt="plane ticket" />
            </motion.div>
            <motion.div
              className="ticket right"
              initial="initial"
              animate="animate"
              variants={rightTicketVariants}
            >
              <img src={ticketPisaImg} alt="plane ticket" />
            </motion.div>
          </div>
          <div className="lastoria__story">
            <p className="text--lg">
              Bragazzi's opened in Sheffield in 2003 and is owned by Matteo
              Bragazzi. It is an outlier and safe haven for people who enjoy the
              "qualcosa in più".
            </p>
            <div className="line"></div>
            <p className="text--lg">
              Matteo has a brother, Dino, they often holiday together. In Rome
              one evening, enjoying a Shakerato, Matteo's mind drifted. Sorry to
              see him this way, Dino started up a monologue on their family
              history of Italian dining in London. Their father had come over,
              like so many others, and made a business of selling food.
            </p>
            <div className="line"></div>
            <p className="text--lg">
              As Dino reached a point about the Corradi brothers, Matteo
              recognised his fate as the same. And so, the bet was placed over a
              plastic table, outside a bar in Fiano Romano on that hot evening in
              2002. They did a big shop with help from Zia Maria and floated it
              to England, ready for the cafe to come.
            </p>
            <div className="line"></div>
          </div>
          <div className="lastoria__image">
            <img src={earlyDaysImg} alt="A busy cafe" />
          </div>
        </div>
      </AnimatePresence>
    </Layout>
  )
}
