/** @vitest-environment happy-dom */

import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

class MockIntersectionObserver {
    static instances: MockIntersectionObserver[] = [];

    readonly observe = vi.fn((element: Element) => {
        this.observedElements.add(element);
    });
    readonly unobserve = vi.fn((element: Element) => {
        this.observedElements.delete(element);
    });
    readonly disconnect = vi.fn();
    readonly takeRecords = vi.fn(() => []);
    readonly root = null;
    readonly rootMargin: string;
    readonly thresholds: readonly number[] = [];
    readonly observedElements = new Set<Element>();

    private readonly callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        this.rootMargin = options?.rootMargin ?? "";
        MockIntersectionObserver.instances.push(this);
    }

    trigger(target: Element, isIntersecting: boolean) {
        this.callback(
            [{ isIntersecting, target } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
        );
    }
}

// The hook keeps a module-level observer, so each test loads a fresh copy of the module.
async function renderRevealingElements(count: number) {
    vi.resetModules();
    const { useReveal } = await import("@/hooks/useReveal");

    function RevealingElement({ label }: { label: string }) {
        const revealRef = useReveal<HTMLParagraphElement>();

        return <p ref={revealRef}>{label}</p>;
    }

    return render(
        <>
            {Array.from({ length: count }, (_, index) => (
                <RevealingElement key={index} label={`Element ${index}`} />
            ))}
        </>,
    );
}

describe("useReveal", () => {
    afterEach(() => {
        MockIntersectionObserver.instances = [];
        vi.unstubAllGlobals();
    });

    test("shares one observer and reveals each element once it intersects", async () => {
        vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
        await renderRevealingElements(2);

        const [observer] = MockIntersectionObserver.instances;
        const first = screen.getByText("Element 0");
        const second = screen.getByText("Element 1");

        expect(MockIntersectionObserver.instances).toHaveLength(1);
        expect(observer.observedElements).toEqual(new Set([first, second]));

        act(() => observer.trigger(first, false));

        expect(first.dataset.revealed).toBeUndefined();

        act(() => observer.trigger(first, true));

        expect(first.dataset.revealed).toBe("true");
        expect(second.dataset.revealed).toBeUndefined();
        expect(observer.unobserve).toHaveBeenCalledWith(first);
    });

    test("stops observing elements that unmount before they are revealed", async () => {
        vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
        const { unmount } = await renderRevealingElements(1);
        const [observer] = MockIntersectionObserver.instances;

        unmount();

        expect(observer.observedElements.size).toBe(0);
    });

    test("reveals immediately when IntersectionObserver is unavailable", async () => {
        vi.stubGlobal("IntersectionObserver", undefined);
        Reflect.deleteProperty(window, "IntersectionObserver");
        await renderRevealingElements(1);

        expect(screen.getByText("Element 0").dataset.revealed).toBe("true");
    });
});
