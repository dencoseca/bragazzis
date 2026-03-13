import Layout from "@/components/Layout";
import OptimizedImage from "@/components/OptimizedImage";
import { galleryImages } from "@/data/galleryImages";

const preventContextMenu = (e: React.MouseEvent) => e.preventDefault();

export default function IlGiorno() {
    return (
        <Layout pageTitle="Il Giorno" description="Il Giorno — a day at Bragazzi's.">
            <div className="ilgiorno__title text--page-title">IL GIORNO</div>
            <div className="ilgiorno__gallery">
                <div className="ilgiorno__caption ilgiorno__caption--aperto text--display">
                    Aperto
                </div>
                {galleryImages.map((image, index) => (
                    <OptimizedImage
                        key={index}
                        className={`image ${image.sizeClass}`}
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        onContextMenu={preventContextMenu}
                    />
                ))}
                <div className="ilgiorno__caption ilgiorno__caption--chiuso text--display">
                    Chiuso
                </div>
            </div>
        </Layout>
    );
}
