import { useState, type ComponentPropsWithoutRef } from "react";

import type { OptimizedPicture } from "@/types/imagetools";

export interface OptimizedImageProps extends Omit<ComponentPropsWithoutRef<"picture">, "children"> {
    image: OptimizedPicture;
    alt: string;
    sizes: string;
    priority?: boolean;
    revealOnLoad?: boolean;
}

export function OptimizedImage({
    image,
    alt,
    sizes,
    priority = false,
    revealOnLoad = false,
    ...pictureProps
}: OptimizedImageProps) {
    const [hasLoaded, setHasLoaded] = useState(false);
    const { sources, img } = image;

    return (
        <picture {...pictureProps} data-image-loaded={revealOnLoad ? String(hasLoaded) : undefined}>
            {Object.entries(sources).map(([type, srcset]) => (
                <source key={type} srcSet={srcset} type={type} sizes={sizes} />
            ))}
            <img
                src={img.src}
                alt={alt}
                width={img.w}
                height={img.h}
                sizes={sizes}
                loading={priority ? "eager" : "lazy"}
                decoding={priority ? "sync" : "async"}
                fetchPriority={priority ? "high" : undefined}
                onLoad={revealOnLoad ? () => setHasLoaded(true) : undefined}
            />
        </picture>
    );
}
