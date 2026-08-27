import { useState, type ComponentPropsWithoutRef, type Ref } from "react";

import type { OptimizedPicture } from "@/types/imagetools";

export interface OptimizedImageProps extends Omit<ComponentPropsWithoutRef<"picture">, "children"> {
    image: OptimizedPicture;
    alt: string;
    sizes: string;
    pictureRef?: Ref<HTMLPictureElement>;
    priority?: boolean;
    revealOnLoad?: boolean;
    shouldLoad?: boolean;
}

function getPlaceholderImageSrc(width: number, height: number) {
    return `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"></svg>`,
    )}`;
}

export function OptimizedImage({
    image,
    alt,
    sizes,
    pictureRef,
    priority = false,
    revealOnLoad = false,
    shouldLoad,
    ...pictureProps
}: OptimizedImageProps) {
    const [hasLoaded, setHasLoaded] = useState(false);
    const resolvedShouldLoad = shouldLoad ?? true;
    const loading = priority || shouldLoad === true ? "eager" : "lazy";
    const { sources, img } = image;

    return (
        <picture
            {...pictureProps}
            ref={pictureRef}
            data-image-loaded={revealOnLoad ? String(hasLoaded) : undefined}
        >
            {resolvedShouldLoad
                ? Object.entries(sources).map(([type, srcset]) => (
                      <source key={type} srcSet={srcset} type={type} sizes={sizes} />
                  ))
                : null}
            <img
                src={resolvedShouldLoad ? img.src : getPlaceholderImageSrc(img.w, img.h)}
                alt={alt}
                width={img.w}
                height={img.h}
                sizes={sizes}
                loading={loading}
                decoding={resolvedShouldLoad && priority ? "sync" : "async"}
                fetchPriority={resolvedShouldLoad && priority ? "high" : undefined}
                onLoad={revealOnLoad && resolvedShouldLoad ? () => setHasLoaded(true) : undefined}
            />
        </picture>
    );
}
