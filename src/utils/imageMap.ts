/**
 * Maps original image imports (JPG/PNG) to their WebP counterparts.
 *
 * Uses Vite's `import.meta.glob` to eagerly resolve all WebP files in the
 * assets directory so that components can look up the optimised version of
 * any image at render time without additional imports.
 */

const webpModules = import.meta.glob<string>("@/assets/images/*.webp", {
    eager: true,
    import: "default",
});

const jpgModules = import.meta.glob<string>(
    "@/assets/images/*.{jpg,jpeg,png}",
    {
        eager: true,
        import: "default",
    },
);

function baseName(globPath: string): string {
    return globPath.replace(/.*\//, "").replace(/\.[^.]+$/, "");
}

// Build a lookup: resolved original URL → resolved WebP URL
const originalToWebp = new Map<string, string>();

const webpByName = new Map<string, string>();
for (const [path, url] of Object.entries(webpModules)) {
    webpByName.set(baseName(path), url);
}

for (const [path, url] of Object.entries(jpgModules)) {
    const name = baseName(path);
    const webpUrl = webpByName.get(name);
    if (webpUrl) {
        originalToWebp.set(url, webpUrl);
    }
}

/** Given a resolved image URL (from a standard Vite import), return the WebP URL if available. */
export function getWebpSrc(originalSrc: string): string | undefined {
    return originalToWebp.get(originalSrc);
}
