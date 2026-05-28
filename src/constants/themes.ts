export const theme = {
    light: {
        palette: {
            background: "#f6f4f1",
            content: {
                primary: "#1d1d1d",
            },
        },
    },
    dark: {
        palette: {
            background: "#1d1d1d",
            content: {
                primary: "#f6f4f1",
            },
        },
    },
};

export type Theme = (typeof theme)[keyof typeof theme];
