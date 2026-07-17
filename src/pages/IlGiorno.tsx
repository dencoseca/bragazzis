import { Layout } from "@/components/layout/Layout";
import { publicPageRoutes } from "@/constants/routes";
import { themeNames } from "@/constants/themes";
import { IlGiornoGallery } from "@/pages/il-giorno/IlGiornoGallery";

const IL_GIORNO_ROUTE = publicPageRoutes.ilGiorno;

export function IlGiorno() {
    return (
        <Layout
            pageTitle={IL_GIORNO_ROUTE.pageTitle}
            description={IL_GIORNO_ROUTE.description}
            theme={themeNames.dark}
            scrollToTopBehavior="auto"
        >
            <h1 className="ilgiorno__title text--page-title">IL GIORNO</h1>
            <IlGiornoGallery />
        </Layout>
    );
}
