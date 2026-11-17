import { expect, test } from "vite-plus/test";

import { countChangedPixels } from "./raw-pixels.mjs";

test("counts exact RGBA differences once per pixel within unaligned buffer views", () => {
    const before = Buffer.alloc(30, 11).subarray(1, 25);
    const after = Buffer.alloc(30, 42).subarray(3, 27);
    before.copy(after);
    expect(countChangedPixels(before, after)).toBe(0);
    for (let channel = 0; channel < 4; channel++) after[4 * channel + channel]++;
    after.fill(0, 16, 20);
    expect(countChangedPixels(before, after)).toBe(5);
});
