import type { OptimizedPicture } from "@/types/imagetools";

export interface OptimizedImageProps {
    image: OptimizedPicture;
    alt: string;
    sizes: string;
    className?: string;
    imgClassName?: string;
    priority?: boolean;
    loading?: "eager" | "lazy";
    onContextMenu?: React.MouseEventHandler<HTMLImageElement>;
}

export function OptimizedImage({
    image,
    alt,
    sizes,
    className,
    imgClassName,
    priority = false,
    loading,
    onContextMenu,
}: OptimizedImageProps) {
    const resolvedLoading = loading ?? (priority ? "eager" : "lazy");
    const { sources, img } = image;

    return (
        <picture className={className}>
            {Object.entries(sources).map(([type, srcset]) => (
                <source key={type} srcSet={srcset} type={type} sizes={sizes} />
            ))}
            <img
                className={imgClassName}
                src={img.src}
                alt={alt}
                width={img.w}
                height={img.h}
                sizes={sizes}
                loading={resolvedLoading}
                decoding={priority ? "sync" : "async"}
                fetchPriority={priority ? "high" : undefined}
                onContextMenu={onContextMenu}
            />
        </picture>
    );
}
