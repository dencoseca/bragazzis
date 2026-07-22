import { useEffect, useRef, useState, type RefCallback } from "react";

import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { galleryImages, type GalleryImageSize } from "@/pages/il-giorno/galleryImages";

const INITIAL_EAGER_GALLERY_IMAGE_COUNT = 8;
const GALLERY_IMAGE_LOAD_AHEAD_COUNT = 5;
const GALLERY_IMAGE_PRELOAD_ROOT_MARGIN = "1200px 0px";

function getGalleryLoadIndex(index: number) {
    return Math.min(galleryImages.length - 1, index + GALLERY_IMAGE_LOAD_AHEAD_COUNT);
}

function getGalleryImageSizes(size: GalleryImageSize) {
    return `${getBreakpointMediaQuery("mobile")} 100vw, ${size}vw`;
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
            {galleryImages.map((image, index) => {
                const shouldLoadImage = index <= loadedThroughIndex;

                return (
                    <OptimizedImage
                        key={index}
                        pictureRef={getGalleryImageElementRef(index)}
                        className="image"
                        data-size={image.size}
                        image={image.image}
                        alt={image.alt}
                        sizes={getGalleryImageSizes(image.size)}
                        loading={shouldLoadImage ? "eager" : "lazy"}
                        shouldLoad={shouldLoadImage}
                    />
                );
            })}
            <div className="ilgiorno__caption ilgiorno__caption--chiuso text--display">Chiuso</div>
        </div>
    );
}
