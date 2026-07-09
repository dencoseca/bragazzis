import type { Ref } from "react";

import type { OptimizedPicture } from "@/types/imagetools";

export interface OptimizedImageProps {
    image: OptimizedPicture;
    alt: string;
    sizes: string;
    className?: string;
    "data-size"?: number;
    pictureRef?: Ref<HTMLPictureElement>;
    priority?: boolean;
    loading?: "eager" | "lazy";
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
    className,
    "data-size": dataSize,
    pictureRef,
    priority = false,
    loading,
    shouldLoad = true,
}: OptimizedImageProps) {
    const resolvedLoading = loading ?? (priority ? "eager" : "lazy");
    const { sources, img } = image;

    return (
        <picture className={className} data-size={dataSize} ref={pictureRef}>
            {shouldLoad
                ? Object.entries(sources).map(([type, srcset]) => (
                      <source key={type} srcSet={srcset} type={type} sizes={sizes} />
                  ))
                : null}
            <img
                src={shouldLoad ? img.src : getPlaceholderImageSrc(img.w, img.h)}
                alt={alt}
                width={img.w}
                height={img.h}
                sizes={sizes}
                loading={resolvedLoading}
                decoding={shouldLoad && priority ? "sync" : "async"}
                fetchPriority={shouldLoad && priority ? "high" : undefined}
            />
        </picture>
    );
}
