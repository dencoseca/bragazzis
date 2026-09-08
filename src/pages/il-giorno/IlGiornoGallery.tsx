import { useEffect, useRef, useState, type CSSProperties, type RefCallback } from "react";

import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { galleryImages } from "@/pages/il-giorno/galleryImages";

const INITIAL_EAGER_GALLERY_IMAGE_COUNT = 2;
const GALLERY_IMAGE_LOAD_AHEAD_COUNT = 3;
const GALLERY_IMAGE_PRELOAD_ROOT_MARGIN = "1200px 0px";

function getGalleryLoadIndex(index: number) {
    return Math.min(galleryImages.length - 1, index + GALLERY_IMAGE_LOAD_AHEAD_COUNT);
}

// Preparation, service, lunch, then closing: pairs punctuate the larger scenes.
const spreadLengths = [3, 3, 3, 3, 2, 3, 3, 2, 3, 1];
const gallerySpreads: { start: number; images: typeof galleryImages }[] = [];
for (let start = 0; start < galleryImages.length;) {
    const length = spreadLengths[gallerySpreads.length] ?? 3;
    gallerySpreads.push({ start, images: galleryImages.slice(start, start + length) });
    start += length;
}

function getSpreadGeometry(images: typeof galleryImages) {
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

function getGalleryImageSizes(position: number, spread: typeof galleryImages) {
    const { ratios, lead, stack, total } = getSpreadGeometry(spread);
    const desktopFraction =
        spread.length === 3 ? (position === 0 ? lead : stack) / total : ratios[position]! / total;
    const mobileFraction =
        spread.length === 3
            ? position === 0
                ? 1
                : ratios[position]! / (ratios[1]! + ratios[2]!)
            : ratios[position]! / total;
    return `${getBreakpointMediaQuery("mobile")} ${Math.round(90 * mobileFraction)}vw, ${Math.round(92 * desktopFraction)}vw`;
}

export function IlGiornoGallery() {
    const galleryImageElements = useRef<Array<HTMLPictureElement | null>>([]);
    const galleryImageElementRefs = useRef<Array<RefCallback<HTMLPictureElement>>>([]);
    const [loadedThroughIndex, setLoadedThroughIndex] = useState(
        Math.min(galleryImages.length - 1, INITIAL_EAGER_GALLERY_IMAGE_COUNT - 1),
    );

    useEffect(() => {
        if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
            setLoadedThroughIndex(galleryImages.length - 1);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) {
                        continue;
                    }

                    const imageIndex = galleryImageElements.current.indexOf(
                        entry.target as HTMLPictureElement,
                    );

                    if (imageIndex === -1) {
                        continue;
                    }

                    setLoadedThroughIndex((currentIndex) =>
                        Math.max(currentIndex, getGalleryLoadIndex(imageIndex)),
                    );
                }
            },
            {
                rootMargin: GALLERY_IMAGE_PRELOAD_ROOT_MARGIN,
            },
        );

        for (const element of galleryImageElements.current) {
            if (element) {
                observer.observe(element);
            }
        }

        return () => observer.disconnect();
    }, []);

    function getGalleryImageElementRef(index: number) {
        galleryImageElementRefs.current[index] ??= (element) => {
            galleryImageElements.current[index] = element;
        };

        return galleryImageElementRefs.current[index];
    }

    return (
        <div className="ilgiorno__gallery">
            <div className="ilgiorno__caption ilgiorno__caption--aperto text--display">Aperto</div>
            <div className="ilgiorno__photo-essay">
                {gallerySpreads.map(({ start, images: spread }, spreadIndex) => (
                    <div
                        className="ilgiorno__spread"
                        key={spreadIndex}
                        data-count={spread.length}
                        style={getSpreadGeometry(spread).style}
                    >
                        {spread.map((image, position) => {
                            const index = start + position;
                            return (
                                <div className="ilgiorno__photograph" key={index}>
                                    <OptimizedImage
                                        pictureRef={getGalleryImageElementRef(index)}
                                        className="ilgiorno__gallery-image"
                                        image={image.image}
                                        alt={image.alt}
                                        sizes={getGalleryImageSizes(position, spread)}
                                        priority={index === 0}
                                        revealOnLoad
                                        shouldLoad={index <= loadedThroughIndex}
                                        loading="eager"
                                    />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="ilgiorno__caption ilgiorno__caption--chiuso text--display">Chiuso</div>
        </div>
    );
}
