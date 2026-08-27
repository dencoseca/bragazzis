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
        <footer className="footer" data-theme={theme}>
            <div className="footer__lists">
                <div className="footer__list footer__list--contact">
                    <h4 className="text--heading-sm">Contact</h4>
                    <ul>
                        <li className="text--sm">
                            <a
                                className="footer__link"
                                href={address.mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <p>{address.streetAddress}</p>
                                <p>{address.addressLocality}</p>
                                <p>{address.postalCode}</p>
                            </a>
                        </li>
                        <li className="text--sm">
                            <a className="footer__link" href={`mailto:${email}`}>
                                {email}
                            </a>
                        </li>
                        <li className="text--sm">
                            <a className="footer__link" href={phone.href}>
                                {phone.display}
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer__list footer__list--site">
                    <h4 className="text--heading-sm">Site</h4>
                    <ul>
                        <li className="text--sm">
                            &copy;{" "}
                            {`${siteConfig.credits.copyrightStartYear}–${new Date().getFullYear()} ${siteConfig.business.legalName}`}
                        </li>
                        {siteConfig.links.photographyCredits.map((credit, index) => (
                            <li key={credit.url} className="text--sm">
                                {index === 0 ? "photography by " : "& "}
                                <a
                                    className="footer__link"
                                    href={credit.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {credit.label}
                                </a>
                            </li>
                        ))}
                        <li className="text--sm">site by {siteConfig.credits.siteBy}</li>
                    </ul>
                </div>
                <div className="footer__list footer__list--community">
                    <h4 className="text--heading-sm">Social</h4>
                    <ul>
                        {siteConfig.links.social.map((link) => (
                            <li key={link.url} className="text--sm">
                                <a
                                    className="footer__link"
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
            </div>
            <button
                type="button"
                className="footer__scroll-to-top"
                onClick={scrollToTop}
                aria-label="Scroll to top"
            >
                <svg
                    width="52"
                    height="52"
                    viewBox="0 0 52 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M25.989 1.00001C12.1818 1.01574 1.00172 12.2214 1.01745 26.0285C1.03318 39.8356 12.2388 51.0157 26.0459 51C39.853 50.9842 51.0331 39.7786 51.0174 25.9715C51.0017 12.1644 39.7961 0.98428 25.989 1.00001ZM27.4162 12.4126L34.0095 18.9909L32.5969 20.4067L27.0047 14.8273L27.0357 41.9988L25.0357 42.0011L25.0047 14.8296L19.4253 20.4217L18.0095 19.0091L24.5877 12.4158L25.0015 12.0011L26.0003 11L27.0015 11.9989L27.4162 12.4126Z"
                        fill="currentColor"
                    />
                </svg>
            </button>
        </footer>
    );
}
