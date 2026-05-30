export const themeNames = {
    light: "light",
    dark: "dark",
} as const;

export type ThemeName = (typeof themeNames)[keyof typeof themeNames];
