export const artifactRoot = process.env.AUDIT_ARTIFACT_ROOT ?? "/tmp/bragazzis-audit";
export const browserPath =
    process.env.AUDIT_BROWSER_PATH ??
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";
export const siteUrl = process.env.AUDIT_SITE_URL ?? "http://127.0.0.1:4173";
