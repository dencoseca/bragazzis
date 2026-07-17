import { motion } from "motion/react";

import earlyDaysImg from "@/assets/images/early-days.jpg?preset=editorial";
import ticketPisaImg from "@/assets/images/ticket-pisa.jpg?preset=editorial";
import ticketRomaImg from "@/assets/images/ticket-roma.jpg?preset=editorial";
import { Layout } from "@/components/layout/Layout";
import { OptimizedImage } from "@/components/OptimizedImage";
import { smoothTransition } from "@/constants/animations";
import { publicPageRoutes } from "@/constants/routes";
import { themeNames } from "@/constants/themes";

const LA_STORIA_ROUTE = publicPageRoutes.laStoria;

const laStoriaTransition = {
    ...smoothTransition,
    delay: 0.3,
};

const leftTicketVariants = {
    initial: {
        translateY: 300,
        translateX: -500,
        rotate: "-25deg",
    },
    animate: {
        translateY: 0,
        translateX: 0,
        rotate: "-25deg",
        transition: {
            ...laStoriaTransition,
        },
    },
};

const rightTicketVariants = {
    initial: {
        translateY: 300,
        translateX: 500,
        rotate: "25deg",
    },
    animate: {
        translateY: 0,
        translateX: 0,
        rotate: "25deg",
        transition: {
            ...laStoriaTransition,
        },
    },
};

export function LaStoria() {
    return (
        <Layout
            pageTitle={LA_STORIA_ROUTE.pageTitle}
            description={LA_STORIA_ROUTE.description}
            theme={themeNames.light}
        >
            <div className="lastoria">
                <div className="lastoria__title-wrapper">
                    <h1 className="lastoria__title text--page-title">{LA_STORIA_ROUTE.label}</h1>
                </div>
                <div className="lastoria__story">
                    <p className="text--lg">
                        Bragazzi's opened in Sheffield in 2003 and is owned by Matteo Bragazzi. It
                        is an outlier and safe haven for people who enjoy the "qualcosa in più".
                    </p>
                    <div className="line line--ticket-left">
                        <motion.div
                            className="ticket left"
                            initial="initial"
                            animate="animate"
                            variants={leftTicketVariants}
                        >
                            <OptimizedImage
                                image={ticketRomaImg}
                                alt="plane ticket"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </motion.div>
                    </div>
                    <p className="text--lg">
                        Matteo has a brother, Dino, they often holiday together. In Rome one
                        evening, enjoying a Shakerato, Matteo's mind drifted. Sorry to see him this
                        way, Dino started up a monologue on their family history of Italian dining
                        in London. Their father had come over, like so many others, and made a
                        business of selling food.
                    </p>
                    <div className="line line--ticket-right">
                        <motion.div
                            className="ticket right"
                            initial="initial"
                            animate="animate"
                            variants={rightTicketVariants}
                        >
                            <OptimizedImage
                                image={ticketPisaImg}
                                alt="plane ticket"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </motion.div>
                    </div>
                    <p className="text--lg">
                        As Dino reached a point about the Corradi brothers, Matteo recognised his
                        fate as the same. And so, the bet was placed over a plastic table, outside a
                        bar in Fiano Romano on that hot evening in 2002. They did a big shop with
                        help from Zia Maria and floated it to England, ready for the cafe to come.
                    </p>
                    <div className="line"></div>
                </div>
                <div className="lastoria__image">
                    <OptimizedImage
                        image={earlyDaysImg}
                        alt="A busy cafe"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
            </div>
        </Layout>
    );
}
