/** @vitest-environment happy-dom */

import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { useMediaQuery } from "@/hooks/useMediaQuery";

type MediaQueryChangeListener = (event: MediaQueryListEvent) => void;

class ControlledMediaQuery {
    readonly addEventListener = vi.fn(
        (eventType: string, listener: EventListenerOrEventListenerObject) => {
            if (eventType === "change" && typeof listener === "function") {
                this.listeners.add(listener as MediaQueryChangeListener);
            }
        },
    );
    readonly removeEventListener = vi.fn(
        (eventType: string, listener: EventListenerOrEventListenerObject) => {
            if (eventType === "change" && typeof listener === "function") {
                this.listeners.delete(listener as MediaQueryChangeListener);
            }
        },
    );
    readonly media: string;
    matches: boolean;
    onchange: ((this: MediaQueryList, event: MediaQueryListEvent) => unknown) | null = null;
    private readonly listeners = new Set<MediaQueryChangeListener>();

    constructor(media: string, matches: boolean) {
        this.media = media;
        this.matches = matches;
    }

    dispatch(matches: boolean) {
        this.matches = matches;
        const event = { matches, media: this.media } as MediaQueryListEvent;

        for (const listener of this.listeners) {
            listener(event);
        }
    }

    toMediaQueryList(): MediaQueryList {
        const controlledMediaQuery = this;

        return {
            addEventListener: this.addEventListener,
            addListener: vi.fn(),
            dispatchEvent: vi.fn(),
            get matches() {
                return controlledMediaQuery.matches;
            },
            media: this.media,
            onchange: this.onchange,
            removeEventListener: this.removeEventListener,
            removeListener: vi.fn(),
        };
    }
}

function MediaQueryHarness({ query }: { query: string }) {
    const matches = useMediaQuery(query);

    return <output>{String(matches)}</output>;
}

function installMatchMedia(mediaQueries: Map<string, ControlledMediaQuery>) {
    const matchMedia = vi.fn((query: string) => {
        const mediaQuery = mediaQueries.get(query);

        if (!mediaQuery) {
            throw new Error(`No controlled media query configured for ${query}`);
        }

        return mediaQuery.toMediaQueryList();
    });

    vi.stubGlobal("matchMedia", matchMedia);

    return matchMedia;
}

describe("useMediaQuery", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    test("uses the initial match and responds to change events", () => {
        const query = "(max-width: 48rem)";
        const mediaQuery = new ControlledMediaQuery(query, true);
        installMatchMedia(new Map([[query, mediaQuery]]));

        render(<MediaQueryHarness query={query} />);

        expect(screen.getByText("true")).toBeDefined();

        act(() => {
            mediaQuery.dispatch(false);
        });

        expect(screen.getByText("false")).toBeDefined();
    });

    test("removes its change listener on unmount", () => {
        const query = "(prefers-reduced-data: reduce)";
        const mediaQuery = new ControlledMediaQuery(query, false);
        installMatchMedia(new Map([[query, mediaQuery]]));

        const { unmount } = render(<MediaQueryHarness query={query} />);

        expect(mediaQuery.addEventListener).toHaveBeenCalledOnce();

        unmount();

        expect(mediaQuery.removeEventListener).toHaveBeenCalledOnce();
        expect(mediaQuery.removeEventListener).toHaveBeenCalledWith(
            "change",
            mediaQuery.addEventListener.mock.calls[0][1],
        );
    });

    test("re-subscribes when the query changes", () => {
        const mobileQuery = "(max-width: 48rem)";
        const tabletQuery = "(max-width: 64rem)";
        const mobileMediaQuery = new ControlledMediaQuery(mobileQuery, true);
        const tabletMediaQuery = new ControlledMediaQuery(tabletQuery, false);
        installMatchMedia(
            new Map([
                [mobileQuery, mobileMediaQuery],
                [tabletQuery, tabletMediaQuery],
            ]),
        );

        const { rerender } = render(<MediaQueryHarness query={mobileQuery} />);

        expect(screen.getByText("true")).toBeDefined();

        rerender(<MediaQueryHarness query={tabletQuery} />);

        expect(screen.getByText("false")).toBeDefined();
        expect(mobileMediaQuery.removeEventListener).toHaveBeenCalledOnce();
        expect(tabletMediaQuery.addEventListener).toHaveBeenCalledOnce();

        act(() => {
            mobileMediaQuery.dispatch(false);
        });

        expect(screen.getByText("false")).toBeDefined();

        act(() => {
            tabletMediaQuery.dispatch(true);
        });

        expect(screen.getByText("true")).toBeDefined();
    });

    test("returns a non-matching result when rendered without a window", () => {
        const browserWindow = window;

        vi.stubGlobal("window", undefined);

        try {
            expect(renderToString(<MediaQueryHarness query="(max-width: 48rem)" />)).toContain(
                "false",
            );
        } finally {
            vi.stubGlobal("window", browserWindow);
        }
    });
});
