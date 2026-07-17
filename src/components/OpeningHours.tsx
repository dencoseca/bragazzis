import { siteConfig } from "@/constants/siteConfig";

export function OpeningHours() {
    return (
        <ul className="opening-hours">
            {siteConfig.openingHours.display.map((line) => (
                <li key={line}>{line}</li>
            ))}
        </ul>
    );
}
