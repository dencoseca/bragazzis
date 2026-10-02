import { useEffect, useRef, useState } from "react";

import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { useReveal } from "@/hooks/useReveal";
import { galleryImages, type GalleryImagePlacement } from "@/pages/il-giorno/galleryImages";

const INITIAL_EAGER_GALLERY_IMAGE_COUNT = 2;
const GALLERY_IMAGE_LOAD_AHEAD_COUNT = 3;
const GALLERY_IMAGE_PRELOAD_ROOT_MARGIN = "1200px 0px";

// Rendered widths (in vw) of each placement on desktop and on mobile.
const galleryPlacementWidths: Record<GalleryImagePlacement, { desktop: number; mobile: number }> = {
    full: { desktop: 100, mobile: 100 },
    "wide-left": { desktop: 58, mobile: 85 },
    "wide-right": { desktop: 58, mobile: 85 },
    centre: { desktop: 66, mobile: 100 },
    "half-left": { desktop: 50, mobile: 85 },
    "half-right": { desktop: 50, mobile: 85 },
    "narrow-left": { desktop: 34, mobile: 50 },
    "narrow-right": { desktop: 34, mobile: 50 },
};

function getGalleryLoadIndex(index: number) {
    return Math.min(galleryImages.length - 1, index + GALLERY_IMAGE_LOAD_AHEAD_COUNT);
}

function getGalleryImageSizes(placement: GalleryImagePlacement) {
    const { desktop, mobile } = galleryPlacementWidths[placement];

    return `${getBreakpointMediaQuery("mobile")} ${mobile}vw, ${desktop}vw`;
}

interface GalleryFigureProps {
    index: number;
    shouldLoad: boolean;
}

function GalleryFigure({ index, shouldLoad }: GalleryFigureProps) {
    const revealRef = useReveal<HTMLElement>();
    const image = galleryImages[index];

    return (
        <figure
            className="ilgiorno__figure reveal"
            data-placement={image.placement}
            ref={revealRef}
        >
            <OptimizedImage
                className="ilgiorno__gallery-image"
                data-gallery-index={index}
                image={image.image}
                alt={image.alt}
                sizes={getGalleryImageSizes(image.placement)}
                priority={index === 0}
                revealOnLoad
                shouldLoad={shouldLoad}
                loading="eager"
            />
            <span className="ilgiorno__index text--label" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
            </span>
        </figure>
    );
}

export function IlGiornoGallery() {
    const galleryRef = useRef<HTMLDivElement>(null);
    const [loadedThroughIndex, setLoadedThroughIndex] = useState(
        Math.min(galleryImages.length - 1, INITIAL_EAGER_GALLERY_IMAGE_COUNT - 1),
    );

    useEffect(() => {
        if (!("IntersectionObserver" in window)) {
            setLoadedThroughIndex(galleryImages.length - 1);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) {
                        continue;
                    }

                    const imageIndex = Number((entry.target as HTMLElement).dataset.galleryIndex);

                    setLoadedThroughIndex((currentIndex) =>
                        Math.max(currentIndex, getGalleryLoadIndex(imageIndex)),
                    );
                }
            },
            {
                rootMargin: GALLERY_IMAGE_PRELOAD_ROOT_MARGIN,
            },
        );

        for (const element of galleryRef.current?.querySelectorAll("[data-gallery-index]") ?? []) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="ilgiorno__gallery" ref={galleryRef}>
            <p className="ilgiorno__caption ilgiorno__caption--aperto" lang="it">
                Aperto
            </p>
            {galleryImages.map((image, index) => (
                <GalleryFigure
                    key={image.filename}
                    index={index}
                    shouldLoad={index <= loadedThroughIndex}
                />
            ))}
            <p className="ilgiorno__caption ilgiorno__caption--chiuso" lang="it">
                Chiuso
            </p>
        </div>
    );
}
