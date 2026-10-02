import { Link } from "react-router-dom";

import earlyDaysImg from "@/assets/images/early-days.jpg?preset=editorial";
import apertoImg from "@/assets/images/gallery/aperto.jpg?preset=gallery";
import { ArrowIcon } from "@/components/ArrowIcon";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { publicPageRoutes, type PublicPageRoute } from "@/constants/routes";
import { useReveal } from "@/hooks/useReveal";
import type { OptimizedPicture } from "@/types/imagetools";

const CONTINUE_IMAGE_SIZES = `${getBreakpointMediaQuery("mobile")} 100vw, 45vw`;

interface ContinueLink {
    route: PublicPageRoute;
    summary: string;
    image: OptimizedPicture;
    alt: string;
}

const continueLinks: ContinueLink[] = [
    {
        route: publicPageRoutes.laStoria,
        summary: "The story of Bragazzi’s",
        image: earlyDaysImg,
        alt: "the cafe counter in the early days",
    },
    {
        route: publicPageRoutes.ilGiorno,
        summary: "A day at Bragazzi’s",
        image: apertoImg,
        alt: "sandwich board sign outside cafe",
    },
];

function ContinueCard({ link, shouldLoadImage }: { link: ContinueLink; shouldLoadImage: boolean }) {
    const revealRef = useReveal<HTMLLIElement>();

    return (
        <li className="home-continue__item reveal" ref={revealRef}>
            <Link className="home-continue__link" to={link.route.path}>
                <span className="home-continue__figure media-frame">
                    <OptimizedImage
                        image={link.image}
                        alt=""
                        sizes={CONTINUE_IMAGE_SIZES}
                        shouldLoad={shouldLoadImage}
                        revealOnLoad
                    />
                </span>
                <span className="home-continue__title text--heading" lang="it">
                    {link.route.label}
                </span>
                <span className="home-continue__summary text--label">
                    {link.summary} <ArrowIcon direction="right" />
                </span>
            </Link>
        </li>
    );
}

interface HomeContinueProps {
    shouldLoadImages: boolean;
}

export function HomeContinue({ shouldLoadImages }: HomeContinueProps) {
    return (
        <nav className="home-continue" aria-label="Continue reading">
            <p className="home-continue__label text--label" lang="it">
                Continua
            </p>
            <ul className="home-continue__list">
                {continueLinks.map((link) => (
                    <ContinueCard
                        key={link.route.path}
                        link={link}
                        shouldLoadImage={shouldLoadImages}
                    />
                ))}
            </ul>
        </nav>
    );
}
