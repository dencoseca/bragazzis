// Lets components pass CSS custom properties (and Motion values for them) through `style`.
declare module "react" {
    interface CSSProperties {
        [customProperty: `--${string}`]: string | number | undefined;
    }
}

export {};
