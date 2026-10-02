import { publicPageRoutes } from "@/constants/routes";
import { siteConfig } from "@/constants/siteConfig";
import { galleryImages } from "@/pages/il-giorno/galleryImages";
import { IlGiornoGallery } from "@/pages/il-giorno/IlGiornoGallery";

export function IlGiorno() {
    const photographers = siteConfig.links.photographyCredits.map(({ label }) => label).join(" & ");

    return (
        <article className="ilgiorno">
            <header className="ilgiorno__opening">
                <h1 className="ilgiorno__title text--title" lang="it">
                    {publicPageRoutes.ilGiorno.label}
                </h1>
                <p className="ilgiorno__standfirst text--lead">A day at Bragazzi’s.</p>
                <dl className="ilgiorno__details text--label">
                    <div>
                        <dt>Photographs</dt>
                        <dd>{galleryImages.length}</dd>
                    </div>
                    <div>
                        <dt>Photography</dt>
                        <dd>{photographers}</dd>
                    </div>
                </dl>
            </header>
            <IlGiornoGallery />
        </article>
    );
}
