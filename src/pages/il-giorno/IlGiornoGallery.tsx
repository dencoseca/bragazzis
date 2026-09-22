import { useEffect, useRef, useState } from "react";

import { OptimizedImage } from "@/components/OptimizedImage";
import { galleryImages, gallerySpreads } from "@/pages/il-giorno/galleryImages";

const INITIAL_EAGER_GALLERY_IMAGE_COUNT = 2;
const GALLERY_IMAGE_LOAD_AHEAD_COUNT = 3;
const GALLERY_IMAGE_PRELOAD_ROOT_MARGIN = "1200px 0px";

function getGalleryLoadIndex(index: number) {
    return Math.min(galleryImages.length - 1, index + GALLERY_IMAGE_LOAD_AHEAD_COUNT);
}

const indexedGallerySpreads = gallerySpreads.map((spread, index) => ({
    ...spread,
    start: gallerySpreads
        .slice(0, index)
        .reduce((sum, previous) => sum + previous.images.length, 0),
}));

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
            <div className="ilgiorno__caption ilgiorno__caption--aperto text--display">Aperto</div>
            <div className="ilgiorno__photo-essay">
                {indexedGallerySpreads.map(({ start, images: spread, style, sizes }) => (
                    <div
                        className="ilgiorno__spread"
                        key={spread[0]!.filename}
                        data-count={spread.length}
                        style={style}
                    >
                        {spread.map((image, position) => {
                            const index = start + position;
                            return (
                                <div className="ilgiorno__photograph" key={image.filename}>
                                    <OptimizedImage
                                        className="ilgiorno__gallery-image"
                                        data-gallery-index={index}
                                        image={image.image}
                                        alt={image.alt}
                                        sizes={sizes[position]}
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
