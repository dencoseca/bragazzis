import earlyDaysImg from "@/assets/images/early-days.jpg?preset=editorial";
import ticketPisaImg from "@/assets/images/ticket-pisa.jpg?preset=editorial";
import ticketRomaImg from "@/assets/images/ticket-roma.jpg?preset=editorial";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { publicPageRoutes } from "@/constants/routes";

const STORY_IMAGE_SIZES = `${getBreakpointMediaQuery("mobile")} 100vw, 50vw`;

export function LaStoria() {
    return (
        <div className="lastoria">
            <div className="lastoria__title-wrapper">
                <span className="lastoria__eyebrow">Sheffield · 2003</span>
                <h1 className="lastoria__title text--page-title">
                    {publicPageRoutes.laStoria.label}
                </h1>
            </div>
            <div className="lastoria__story">
                <p className="lastoria__intro text--lg">
                    Bragazzi's opened in Sheffield in 2003 and is owned by Matteo Bragazzi. It is an
                    outlier and safe haven for people who enjoy the "qualcosa in più".
                </p>
                <div className="lastoria__tickets">
                    <OptimizedImage
                        className="lastoria__ticket lastoria__ticket--left"
                        image={ticketRomaImg}
                        alt="plane ticket"
                        sizes={STORY_IMAGE_SIZES}
                        loading="eager"
                    />
                    <OptimizedImage
                        className="lastoria__ticket lastoria__ticket--right"
                        image={ticketPisaImg}
                        alt="plane ticket"
                        sizes={STORY_IMAGE_SIZES}
                        loading="eager"
                    />
                </div>
                <div className="lastoria__image">
                    <OptimizedImage
                        image={earlyDaysImg}
                        alt="A busy cafe"
                        sizes={STORY_IMAGE_SIZES}
                    />
                </div>
                <div className="lastoria__prose">
                    <p className="text--md">
                        Matteo has a brother, Dino, they often holiday together. In Rome one
                        evening, enjoying a Shakerato, Matteo's mind drifted. Sorry to see him this
                        way, Dino started up a monologue on their family history of Italian dining
                        in London. Their father had come over, like so many others, and made a
                        business of selling food.
                    </p>
                    <p className="text--md">
                        As Dino reached a point about the Corradi brothers, Matteo recognised his
                        fate as the same. And so, the bet was placed over a plastic table, outside a
                        bar in Fiano Romano on that hot evening in 2002. They did a big shop with
                        help from Zia Maria and floated it to England, ready for the cafe to come.
                    </p>
                </div>
            </div>
        </div>
    );
}
