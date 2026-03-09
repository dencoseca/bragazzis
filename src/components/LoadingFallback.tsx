function LoadingFallback() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#1d1d1d",
                color: "#f6f4f1",
                fontFamily: "'Josefin Sans', sans-serif",
            }}
        >
            <p>Loading…</p>
        </div>
    );
}

export default LoadingFallback;
