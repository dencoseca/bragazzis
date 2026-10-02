/**
 * Shared animation transition presets used across components. Every curve decelerates without
 * overshoot; nothing bounces.
 *
 * - `introTransition` — slow page-level entrances (HomeHero)
 * - `quickTransition` — short UI state changes (Header menu label)
 * - `menuTransition` — the mobile menu sheet and its links (Menu)
 */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const introTransition = {
    duration: 1.6,
    ease: EASE_OUT,
};

export const quickTransition = {
    duration: 0.4,
    ease: EASE_IN_OUT,
};

export const menuTransition = {
    duration: 0.9,
    ease: EASE_OUT,
};

export const menuExitTransition = {
    duration: 0.5,
    ease: EASE_IN_OUT,
};
