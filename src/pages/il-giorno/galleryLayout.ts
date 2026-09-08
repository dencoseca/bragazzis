import type { CSSProperties } from "react";

import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import type { GalleryImage } from "@/pages/il-giorno/galleryImages";

function getSpreadGeometry(images: readonly GalleryImage[]) {
    const ratios = images.map(({ image }) => image.img.w / image.img.h);
    const lead = ratios[0]!;
    const stack = images.length === 3 ? 1 / (1 / ratios[1]! + 1 / ratios[2]!) : 0;
    const total =
        images.length === 3 ? lead + stack : ratios.reduce((sum, ratio) => sum + ratio, 0);
    return {
        ratios,
        lead,
        stack,
        total,
        style: {
            "--spread-height": `calc((100cqw - var(--gallery-gap) * ${images.length === 3 ? 1 - stack : images.length - 1}) / ${total})`,
            "--lead-width": `calc(var(--spread-height) * ${lead})`,
            "--columns": ratios.map((ratio) => `${ratio}fr`).join(" "),
            "--pair-columns": ratios
                .slice(1)
                .map((ratio) => `${ratio}fr`)
                .join(" "),
            "--stack-rows": ratios
                .slice(1)
                .map((ratio) => `${100 / ratio}fr`)
                .join(" "),
        } as CSSProperties,
    };
}

export function getGallerySpreadLayout(spread: readonly GalleryImage[]) {
    const { ratios, lead, stack, total, style } = getSpreadGeometry(spread);
    const sizes = spread.map((_, position) => {
        const desktopFraction =
            spread.length === 3
                ? (position === 0 ? lead : stack) / total
                : ratios[position]! / total;
        const mobileFraction =
            spread.length === 3
                ? position === 0
                    ? 1
                    : ratios[position]! / (ratios[1]! + ratios[2]!)
                : ratios[position]! / total;
        return `${getBreakpointMediaQuery("mobile")} ${Math.round(90 * mobileFraction)}vw, ${Math.round(92 * desktopFraction)}vw`;
    });
    return { style, sizes };
}
