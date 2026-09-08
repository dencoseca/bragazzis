import { useEffect, useRef, useState, type RefCallback } from "react";

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
                                        pictureRef={getGalleryImageElementRef(index)}
                                        className="ilgiorno__gallery-image"
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
