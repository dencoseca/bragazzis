/** @vitest-environment happy-dom */

import { act, renderHook } from "@testing-library/react";
import { expect, test, vi } from "vite-plus/test";

import { useMediaQuery } from "@/hooks/useMediaQuery";

test("reuses the subscribed media list until the query changes", () => {
    using matchMedia = vi.spyOn(window, "matchMedia");
    const { result, rerender, unmount } = renderHook((query: string) => useMediaQuery(query), {
        initialProps: "(min-width: 1px)",
    });

    rerender("(min-width: 1px)");
    expect(matchMedia).toHaveBeenCalledTimes(1);
    const first = matchMedia.mock.results[0].value;
    const removeFirst = vi.spyOn(first, "removeEventListener");
    const initial = result.current;
    vi.spyOn(first, "matches", "get").mockReturnValue(!initial);
    act(() => first.dispatchEvent(new Event("change")));
    expect(result.current).toBe(!initial);

    rerender("(min-width: 2px)");
    expect(removeFirst).toHaveBeenCalledWith("change", expect.any(Function));
    expect(matchMedia).toHaveBeenCalledTimes(2);
    const second = matchMedia.mock.results[1].value;
    expect(result.current).toBe(second.matches);
    const removeSecond = vi.spyOn(second, "removeEventListener");
    unmount();
    expect(removeSecond).toHaveBeenCalledWith("change", expect.any(Function));
});
