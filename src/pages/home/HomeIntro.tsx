import teamImg from "@/assets/images/last-goodbyes-color.jpg?preset=editorial";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { useReveal } from "@/hooks/useReveal";

const TEAM_IMAGE_SIZES = `${getBreakpointMediaQuery("mobile")} 100vw, 58vw`;

interface HomeIntroProps {
    shouldLoadImage: boolean;
}

export function HomeIntro({ shouldLoadImage }: HomeIntroProps) {
    const statementRef = useReveal<HTMLHeadingElement>();
    const leadRef = useReveal<HTMLParagraphElement>();
    const figureRef = useReveal<HTMLElement>();
    const bodyRef = useReveal<HTMLDivElement>();

    return (
        <section className="home-intro" aria-labelledby="home-intro-statement">
            <h2
                className="home-intro__statement text--display reveal"
                id="home-intro-statement"
                ref={statementRef}
            >
                Roam freely and find inspiration…{" "}
                <em>or that obscure pasta shape that you’ve been looking for</em>
            </h2>
            <p className="home-intro__label text--label" lang="it">
                Chi siamo
            </p>
            <p className="home-intro__lead text--lead reveal" ref={leadRef}>
                We are a small team of people, with different interests and experiences, but with a
                common appreciation for the somewhat overlooked, and at times undervalued occupation
                of shopkeeping, and the unrelenting pursuit of making good coffee.
            </p>
            <figure className="home-intro__figure media-frame reveal" ref={figureRef}>
                <OptimizedImage
                    image={teamImg}
                    alt="three of the team laughing together in the kitchen"
                    sizes={TEAM_IMAGE_SIZES}
                    shouldLoad={shouldLoadImage}
                    revealOnLoad
                />
            </figure>
            <div className="home-intro__body text--body reveal" ref={bodyRef}>
                <p>
                    Bragazzi’s is a cafe, delicatessen and shop. We sell Italian perishables and dry
                    goods, all of which are good to eat. Most people come for the sandwiches, which
                    are potent assemblies of D.O.C cheese, salami and preserved vegetables.
                </p>
                <p>
                    At breakfast, we have pastries. In winter, we have shelves of hard-to-find
                    Christmas produce direct from producers in Italy.
                </p>
            </div>
        </section>
    );
}
