import { publicPageRoutes } from "@/constants/routes";
import { IlGiornoGallery } from "@/pages/il-giorno/IlGiornoGallery";

export function IlGiorno() {
    return (
        <article className="ilgiorno">
            <header className="ilgiorno__opening">
                <h1 className="ilgiorno__title text--title" lang="it">
                    {publicPageRoutes.ilGiorno.label}
                </h1>
                <p className="ilgiorno__standfirst text--lead">A day at Bragazzi’s.</p>
            </header>
            <IlGiornoGallery />
        </article>
    );
}
