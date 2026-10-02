type ArrowDirection = "up" | "right" | "up-right";

const arrowRotation: Record<ArrowDirection, number> = {
    up: 0,
    "up-right": 45,
    right: 90,
};

/** A hairline arrow that inherits the surrounding text colour and size. */
export function ArrowIcon({ direction }: { direction: ArrowDirection }) {
    return (
        <svg
            className="arrow-icon"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            focusable="false"
            style={{ rotate: `${arrowRotation[direction]}deg` }}
        >
            <path d="M8 14.5V2M3 6.5 8 1.5l5 5" stroke="currentColor" strokeWidth="1.1" />
        </svg>
    );
}
