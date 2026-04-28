/// <reference types="vite-plus/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module "*&as=picture" {
    import type { OptimizedPicture } from "@/types/imagetools";
    const picture: OptimizedPicture;
    export default picture;
}
