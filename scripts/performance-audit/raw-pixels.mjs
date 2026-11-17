export function countChangedPixels(before, after) {
    let count = 0;
    for (let i = 0; i < before.length; i += 4) {
        if (
            before[i] !== after[i] ||
            before[i + 1] !== after[i + 1] ||
            before[i + 2] !== after[i + 2] ||
            before[i + 3] !== after[i + 3]
        ) {
            count++;
        }
    }
    return count;
}
