import React from "react";

import { Layout } from "@/components/Layout";
import { OptimizedImage } from "@/components/OptimizedImage";
import { theme } from "@/constants/themes";
import { galleryImages } from "@/data/galleryImages";

const PAGE_TITLE = "Il Giorno";
const PAGE_DESCRIPTION = "Il Giorno — a day at Bragazzi's.";

export function IlGiorno() {
    return (
        <Layout
            pageTitle={PAGE_TITLE}
            description={PAGE_DESCRIPTION}
            theme={theme.dark}
            scrollToTopBehavior="auto"
        >
            <div className="ilgiorno__title text--page-title">IL GIORNO</div>
            <div className="ilgiorno__gallery">
                <div className="ilgiorno__caption ilgiorno__caption--aperto text--display">
                    Aperto
                </div>
                {galleryImages.map((image, index) => (
                    <OptimizedImage
                        key={index}
                        className={`image ${image.sizeClass}`}
                        image={image.image}
                        alt={image.alt}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
                    />
                ))}
                <div className="ilgiorno__caption ilgiorno__caption--chiuso text--display">
                    Chiuso
                </div>
            </div>
        </Layout>
    );
}
