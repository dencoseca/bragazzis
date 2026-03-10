/**
 * Shared animation transition presets used across components.
 *
 * - `smoothTransition`     — page-level entrance animations (Cover, LaStoria)
 * - `quickTransition`      — shorter UI transitions (Header hamburger toggle)
 * - `menuSlideTransition`  — menu slide/link animations (Menu)
 */

const SMOOTH_EASE: [number, number, number, number] = [0.43, 0.13, 0.13, 0.96];
const MENU_EASE: [number, number, number, number] = [0.13, 0.43, 0.45, 0.96];

export const smoothTransition = {
    duration: 1.1,
    ease: SMOOTH_EASE,
};

export const quickTransition = {
    duration: 0.6,
    ease: SMOOTH_EASE,
};

export const menuSlideTransition = {
    duration: 0.6,
    ease: MENU_EASE,
};
