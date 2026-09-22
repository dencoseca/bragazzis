import { publicPageRoutes } from "@/constants/routes";
import { IlGiornoGallery } from "@/pages/il-giorno/IlGiornoGallery";

export function IlGiorno() {
    return (
        <>
            <div className="ilgiorno__heading">
                <span className="ilgiorno__eyebrow">A day at Bragazzi's</span>
                <h1 className="ilgiorno__title text--page-title">
                    {publicPageRoutes.ilGiorno.label}
                </h1>
            </div>
            <IlGiornoGallery />
        </>
    );
}
