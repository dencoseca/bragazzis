import { OptimizedImage } from "@/components/OptimizedImage";
import { getBreakpointMediaQuery } from "@/constants/breakpoints";
import { galleryImages, type GalleryImageSize } from "@/pages/il-giorno/galleryImages";

function getGalleryImageSizes(size: GalleryImageSize) {
    return `${getBreakpointMediaQuery("mobile")} 100vw, ${size}vw`;
}

export function IlGiornoGallery() {
    return (
        <div className="ilgiorno__gallery">
            <div className="ilgiorno__caption ilgiorno__caption--aperto text--display">Aperto</div>
            {galleryImages.map((image, index) => (
                <OptimizedImage
                    key={index}
                    className="ilgiorno__gallery-image"
                    data-size={image.size}
                    image={image.image}
                    alt={image.alt}
                    sizes={getGalleryImageSizes(image.size)}
                    priority={index === 0}
                    revealOnLoad
                />
            ))}
            <div className="ilgiorno__caption ilgiorno__caption--chiuso text--display">Chiuso</div>
        </div>
    );
}
