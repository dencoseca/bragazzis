// Runs in the page through Playwright.
export async function readGalleryPhotos() {
    const pictures = document.querySelectorAll("picture[data-gallery-index]");
    return Promise.all(
        Array.from(pictures, async (picture) => {
            const image = picture.querySelector("img");
            const src = image?.currentSrc ?? "";
            let loaded = false;
            if (image?.complete && image.naturalWidth > 0 && /^https?:/.test(src)) {
                try {
                    await image.decode();
                    loaded = image.currentSrc === src && !picture.hasAttribute("data-image-error");
                } catch {
                    // A completed request can still fail to decode.
                }
            }
            return { src: src.split("/").pop(), alt: image?.alt ?? "", loaded };
        }),
    );
}
