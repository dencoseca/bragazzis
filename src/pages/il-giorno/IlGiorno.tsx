import { publicPageRoutes } from "@/constants/routes";
import { IlGiornoGallery } from "@/pages/il-giorno/IlGiornoGallery";

export function IlGiorno() {
    return (
        <>
            <h1 className="ilgiorno__title text--page-title">{publicPageRoutes.ilGiorno.label}</h1>
            <IlGiornoGallery />
        </>
    );
}
