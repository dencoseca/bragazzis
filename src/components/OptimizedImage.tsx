import { useState, type ComponentPropsWithoutRef, type SyntheticEvent, type Ref } from "react";

import type { OptimizedPicture } from "@/types/imagetools";

export interface OptimizedImageProps extends Omit<ComponentPropsWithoutRef<"picture">, "children"> {
    image: OptimizedPicture;
    alt: string;
    sizes: string;
    pictureRef?: Ref<HTMLPictureElement>;
    priority?: boolean;
    revealOnLoad?: boolean;
    shouldLoad?: boolean;
    loading?: "eager" | "lazy";
    onReady?: () => void;
}

function getPlaceholderImageSrc(width: number, height: number, hasFailed = false) {
    return `data:image/svg+xml,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${hasFailed ? '<rect width="100%" height="100%" fill="#333"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-size="24" fill="#eee">Image unavailable</text>' : ""}</svg>`,
    )}`;
}

function getSourceMimeType(format: string) {
    return format.includes("/") ? format : `image/${format}`;
}

export function OptimizedImage({
    image,
    alt,
    sizes,
    pictureRef,
    priority = false,
    revealOnLoad = false,
    shouldLoad,
    loading = "lazy",
    onReady,
    ...pictureProps
}: OptimizedImageProps) {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [hasFailed, setHasFailed] = useState(false);
    const resolvedShouldLoad = shouldLoad ?? true;
    const canRequestImage = resolvedShouldLoad && !hasFailed;
    const { sources, img } = image;

    async function handleLoad(event: SyntheticEvent<HTMLImageElement>) {
        const renderedImage = event.currentTarget;

        if (typeof renderedImage.decode === "function") {
            await renderedImage.decode().catch(() => undefined);
        }

        setHasLoaded(true);
        onReady?.();
    }

    return (
        <picture
            {...pictureProps}
            ref={pictureRef}
            data-image-loaded={revealOnLoad ? String(hasLoaded) : undefined}
            data-image-error={hasFailed ? "true" : undefined}
        >
            {canRequestImage
                ? Object.entries(sources).map(([type, srcset]) => (
                      <source
                          key={type}
                          srcSet={srcset}
                          type={getSourceMimeType(type)}
                          sizes={sizes}
                      />
                  ))
                : null}
            <img
                src={canRequestImage ? img.src : getPlaceholderImageSrc(img.w, img.h, hasFailed)}
                alt={hasFailed && alt ? `Image unavailable: ${alt}` : alt}
                width={img.w}
                height={img.h}
                sizes={sizes}
                loading={resolvedShouldLoad ? (priority ? "eager" : loading) : "lazy"}
                decoding={canRequestImage && priority ? "sync" : "async"}
                fetchPriority={canRequestImage && priority ? "high" : undefined}
                onLoad={(revealOnLoad || onReady) && canRequestImage ? handleLoad : undefined}
                onError={canRequestImage ? () => setHasFailed(true) : undefined}
            />
        </picture>
    );
}
