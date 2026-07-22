export type BreakpointName = "mobile" | "tablet";

export function getBreakpointMediaQuery(breakpoint: BreakpointName): string {
    return `(max-width: ${__BREAKPOINTS__[breakpoint]})`;
}
