import { ArrowIcon } from "@/components/ArrowIcon";
import { OpeningHours } from "@/components/OpeningHours";
import { visitSectionId } from "@/constants/routes";
import { siteConfig } from "@/constants/siteConfig";
import type { ThemeName } from "@/constants/themes";

interface FooterProps {
    theme: ThemeName;
    scrollToTopBehavior?: ScrollBehavior;
}

export function Footer({ theme, scrollToTopBehavior = "smooth" }: FooterProps) {
    const { address, email, phone } = siteConfig.business;

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: scrollToTopBehavior,
        });
    }

    return (
        <footer className="footer" id={visitSectionId} data-theme={theme}>
            <div className="footer__visit">
                <h2 className="footer__label text--label">Visit</h2>
                <a
                    className="footer__address text--display"
                    href={address.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                >
                    <span>{address.streetAddress},</span>{" "}
                    <span>
                        {address.addressLocality} {address.postalCode}
                    </span>
                    <span className="footer__directions text--label">
                        Directions <ArrowIcon direction="up-right" />
                    </span>
                </a>
            </div>
            <div className="footer__hours">
                <h2 className="footer__label text--label">Opening hours</h2>
                <OpeningHours className="text--label" />
            </div>
            <div className="footer__lists text--label">
                <div className="footer__list footer__list--contact">
                    <h2 className="footer__label text--label">Contact</h2>
                    <ul>
                        <li>
                            <a className="text-link" href={`mailto:${email}`}>
                                {email}
                            </a>
                        </li>
                        <li>
                            <a className="text-link" href={phone.href}>
                                {phone.display}
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer__list footer__list--community">
                    <h2 className="footer__label text--label">Social</h2>
                    <ul>
                        {siteConfig.links.social.map((link) => (
                            <li key={link.url}>
                                <a
                                    className="text-link"
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="footer__list footer__list--site">
                    <h2 className="footer__label text--label">Site</h2>
                    <ul>
                        <li>
                            Photography by{" "}
                            {siteConfig.links.photographyCredits.map((credit, index) => (
                                <span key={credit.url}>
                                    {index > 0 ? " & " : null}
                                    <a
                                        className="text-link"
                                        href={credit.url}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {credit.label}
                                    </a>
                                </span>
                            ))}
                        </li>
                        <li>Site by {siteConfig.credits.siteBy}</li>
                        <li>
                            &copy;{" "}
                            {`${siteConfig.credits.copyrightStartYear}–${new Date().getFullYear()} ${siteConfig.business.legalName}`}
                        </li>
                    </ul>
                </div>
            </div>
            <div className="footer__base">
                <p className="footer__wordmark" aria-hidden="true">
                    Bragazzi’s
                </p>
                <button type="button" className="footer__top text--label" onClick={scrollToTop}>
                    Back to top <ArrowIcon direction="up" />
                </button>
            </div>
        </footer>
    );
}
