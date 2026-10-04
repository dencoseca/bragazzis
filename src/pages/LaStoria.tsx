import { m } from "motion/react";
import { useRef, type ReactNode } from "react";

import earlyDaysImg from "@/assets/images/early-days.jpg?preset=editorial";
import ticketPisaImg from "@/assets/images/ticket-pisa.jpg?preset=editorial";
import ticketRomaImg from "@/assets/images/ticket-roma.jpg?preset=editorial";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { publicPageRoutes } from "@/constants/routes";
import { useReveal } from "@/hooks/useReveal";
import { useScrollParallax } from "@/hooks/useScrollParallax";
import type { OptimizedPicture } from "@/types/imagetools";

const TICKET_IMAGE_SIZES = `${getBreakpointMediaQuery("mobile")} 75vw, 30vw`;
const STORY_IMAGE_SIZES = `${getBreakpointMediaQuery("mobile")} 100vw, 66vw`;

interface StoryChapterProps {
    place: string;
    ticket: OptimizedPicture;
    side: "left" | "right";
    children: ReactNode;
}

function StoryChapter({ place, ticket, side, children }: StoryChapterProps) {
    const chapterRef = useRef<HTMLElement>(null);
    const textRef = useReveal<HTMLDivElement>();
    const ticketRef = useReveal<HTMLDivElement>();
    const ticketParallax = useScrollParallax(chapterRef, {
        output: ["4rem", "-4rem"],
    });

    return (
        <section className={`lastoria__chapter lastoria__chapter--${side}`} ref={chapterRef}>
            <p className="lastoria__place text--label" lang="it">
                {place}
            </p>
            <div className="lastoria__text text--body reveal" ref={textRef}>
                {children}
            </div>
            <m.div className="lastoria__ticket-track" style={{ y: ticketParallax }}>
                {/* The tickets are souvenirs of the trip rather than content, so they stay silent. */}
                <div
                    className={`lastoria__ticket lastoria__ticket--${side} reveal`}
                    ref={ticketRef}
                >
                    <OptimizedImage
                        image={ticket}
                        alt=""
                        sizes={TICKET_IMAGE_SIZES}
                        loading="eager"
                    />
                </div>
            </m.div>
        </section>
    );
}

export function LaStoria() {
    const standfirstRef = useReveal<HTMLParagraphElement>();
    const figureRef = useReveal<HTMLElement>();

    return (
        <article className="lastoria">
            <header className="lastoria__opening">
                <p className="lastoria__kicker text--label">Sheffield, 2003</p>
                <h1 className="lastoria__title text--title" lang="it">
                    {publicPageRoutes.laStoria.label}
                </h1>
                <p className="lastoria__standfirst text--lead reveal" ref={standfirstRef}>
                    Bragazzi’s opened in Sheffield in 2003 and is owned by Matteo Bragazzi. It is an
                    outlier and safe haven for people who enjoy the{" "}
                    <em lang="it">“qualcosa in più”</em>.
                </p>
            </header>
            <StoryChapter place="Roma" ticket={ticketRomaImg} side="right">
                <p>
                    Matteo has a brother, Dino, they often holiday together. In Rome one evening,
                    enjoying a <span lang="it">Shakerato</span>, Matteo’s mind drifted. Sorry to see
                    him this way, Dino started up a monologue on their family history of Italian
                    dining in London. Their father had come over, like so many others, and made a
                    business of selling food.
                </p>
            </StoryChapter>
            <StoryChapter place="Fiano Romano, 2002" ticket={ticketPisaImg} side="left">
                <p>
                    As Dino reached a point about the Corradi brothers, Matteo recognised his fate
                    as the same. And so, the bet was placed over a plastic table, outside a bar in
                    Fiano Romano on that hot evening in 2002. They did a big shop with help from Zia
                    Maria and floated it to England, ready for the cafe to come.
                </p>
            </StoryChapter>
            <figure className="lastoria__figure reveal" ref={figureRef}>
                <div className="media-frame">
                    <OptimizedImage
                        image={earlyDaysImg}
                        alt="A busy cafe"
                        sizes={STORY_IMAGE_SIZES}
                        revealOnLoad
                    />
                </div>
                <figcaption className="text--label">Abbeydale Road, the early days</figcaption>
            </figure>
        </article>
    );
}
