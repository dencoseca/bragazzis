import { getWebpSrc } from "@/utils/imageMap";

interface OptimizedImageProps
    extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

export default function OptimizedImage({
    src,
    alt,
    loading = "lazy",
    ...props
}: OptimizedImageProps) {
    const webpSrc = getWebpSrc(src);

    return (
        <picture>
            {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
            <img src={src} alt={alt} loading={loading} {...props} />
        </picture>
    );
}
