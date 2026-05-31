import { imagetools } from "vite-imagetools";

const imagePresetQueryParam = "preset";

const imagePresets = {
    gallery: {
        w: "360;540;720;960;1200",
        format: "avif;jpg",
        as: "picture",
    },
    editorial: {
        w: "360;540;720;960;1200",
        format: "avif;jpg",
        as: "picture",
    },
    fullWidth: {
        w: "480;768;1024;1440;1920",
        format: "avif;jpg",
        as: "picture",
    },
} as const satisfies Record<string, Record<string, string>>;

type ImagePresetName = keyof typeof imagePresets;

function isImagePresetName(value: string): value is ImagePresetName {
    return Object.hasOwn(imagePresets, value);
}

function getImagePresetDirectives(url: URL) {
    const presetName = url.searchParams.get(imagePresetQueryParam);

    if (!presetName) {
        return new URLSearchParams();
    }

    url.searchParams.delete(imagePresetQueryParam);

    if (!isImagePresetName(presetName)) {
        throw new Error(`Unknown image preset "${presetName}" for ${url.pathname}`);
    }

    return new URLSearchParams(imagePresets[presetName]);
}

export const imageOptimizationPlugin = imagetools({
    cache: {
        dir: "node_modules/.cache/imagetools",
    },
    defaultDirectives: getImagePresetDirectives,
});
