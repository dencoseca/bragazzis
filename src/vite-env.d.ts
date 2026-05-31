/// <reference types="vite-plus/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*&as=picture" {
    import type { OptimizedPicture } from "@/types/imagetools";
    const picture: OptimizedPicture;
    export default picture;
}

declare module "*?preset=gallery" {
    import type { OptimizedPicture } from "@/types/imagetools";
    const picture: OptimizedPicture;
    export default picture;
}

declare module "*?preset=editorial" {
    import type { OptimizedPicture } from "@/types/imagetools";
    const picture: OptimizedPicture;
    export default picture;
}

declare module "*?preset=fullWidth" {
    import type { OptimizedPicture } from "@/types/imagetools";
    const picture: OptimizedPicture;
    export default picture;
}
