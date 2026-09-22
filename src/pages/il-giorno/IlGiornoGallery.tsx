import { useEffect, useRef, useState } from "react";

import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { galleryImages, type GalleryImageSize } from "@/pages/il-giorno/galleryImages";

const INITIAL_EAGER_GALLERY_IMAGE_COUNT = 2;
const GALLERY_IMAGE_LOAD_AHEAD_COUNT = 3;
const GALLERY_IMAGE_PRELOAD_ROOT_MARGIN = "1200px 0px";

function getGalleryLoadIndex(index: number) {
    return Math.min(galleryImages.length - 1, index + GALLERY_IMAGE_LOAD_AHEAD_COUNT);
}

function getGalleryImageSizes(size: GalleryImageSize) {
    return `${getBreakpointMediaQuery("mobile")} 100vw, ${size}vw`;
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
            <div className="ilgiorno__caption ilgiorno__caption--aperto text--display">Aperto</div>
            {galleryImages.map((image, index) => {
                const shouldLoadImage = index <= loadedThroughIndex;

                return (
                    <OptimizedImage
                        key={image.filename}
                        className="ilgiorno__gallery-image"
                        data-gallery-index={index}
                        data-size={image.size}
                        image={image.image}
                        alt={image.alt}
                        sizes={getGalleryImageSizes(image.size)}
                        priority={index === 0}
                        revealOnLoad
                        shouldLoad={shouldLoadImage}
                        loading="eager"
                    />
                );
            })}
            <div className="ilgiorno__caption ilgiorno__caption--chiuso text--display">Chiuso</div>
        </div>
    );
}
