import eggImg from "@/assets/images/egg.jpg?preset=fullWidth";
import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";

interface HomeSeasonalBannerProps {
    shouldLoadImage: boolean;
}

export function HomeSeasonalBanner({ shouldLoadImage }: HomeSeasonalBannerProps) {
    return (
        <section className="home-seasonal-banner">
            <OptimizedImage
                className="home-seasonal-banner__image"
                image={eggImg}
                alt="a gigantic italian chocolate easter egg"
                sizes={`${getBreakpointMediaQuery("mobile")} 100vw, 50vw`}
                shouldLoad={shouldLoadImage}
            />
            <article className="home-seasonal-banner__text">
                <span className="home-seasonal-banner__label">Bragazzi's</span>
                <h2 className="text--display">
                    Each season brings a selection of <em>well considered products</em>
                </h2>
            </article>
        </section>
    );
}
