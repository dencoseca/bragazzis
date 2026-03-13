/**
 * Maps original image imports (JPG/PNG) to their WebP counterparts.
 *
 * Uses Vite's `import.meta.glob` with lazy loading so that the image URL
 * modules are not eagerly bundled. The map is built asynchronously at startup
 * via `initImageMap()` and then accessed synchronously via `getWebpSrc()`.
 */

const webpModules = import.meta.glob<string>("@/assets/images/*.webp", {
    eager: false,
    import: "default",
});

const jpgModules = import.meta.glob<string>(
    "@/assets/images/*.{jpg,jpeg,png}",
    {
        eager: false,
        import: "default",
    },
);

function baseName(globPath: string): string {
    return globPath.replace(/.*\//, "").replace(/\.[^.]+$/, "");
}

// Build a lookup: resolved original URL → resolved WebP URL
const originalToWebp = new Map<string, string>();
let initialized = false;

/** Resolve all lazy glob imports and build the original→WebP lookup map. */
export async function initImageMap(): Promise<void> {
    if (initialized) return;

    const webpByName = new Map<string, string>();
    const webpEntries = await Promise.all(
        Object.entries(webpModules).map(
            async ([path, resolver]) =>
                [baseName(path), await resolver()] as const,
        ),
    );
    for (const [name, url] of webpEntries) {
        webpByName.set(name, url);
    }

    const jpgEntries = await Promise.all(
        Object.entries(jpgModules).map(
            async ([path, resolver]) =>
                [baseName(path), await resolver()] as const,
        ),
    );
    for (const [name, url] of jpgEntries) {
        const webpUrl = webpByName.get(name);
        if (webpUrl) {
            originalToWebp.set(url, webpUrl);
        }
    }

    initialized = true;
}

/** Given a resolved image URL (from a standard Vite import), return the WebP URL if available. */
export function getWebpSrc(originalSrc: string): string | undefined {
    return originalToWebp.get(originalSrc);
}
