import { siteConfig } from "@/constants/siteConfig";

/** The weekly opening hours as a ruled two-column list. */
export function OpeningHours({ className }: { className?: string }) {
    return (
        <dl className={className ? `opening-hours ${className}` : "opening-hours"}>
            {siteConfig.openingHours.display.map(({ days, hours }) => (
                <div className="opening-hours__row" key={days}>
                    <dt>{days}</dt>
                    <dd>{hours}</dd>
                </div>
            ))}
        </dl>
    );
}
