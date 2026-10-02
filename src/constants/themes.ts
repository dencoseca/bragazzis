export const themeNames = {
    light: "light",
    dark: "dark",
    accent: "accent",
} as const;

export type ThemeName = (typeof themeNames)[keyof typeof themeNames];
