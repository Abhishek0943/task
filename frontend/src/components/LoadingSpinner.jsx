
const LoadingSpinner = () => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            gap: "16px",
        }}
    >
        <div
            style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
            }}
        >
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#ffffff",
                        animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                    }}
                />
            ))}
        </div>
        <span
            style={{
                fontSize: "13px",
                color: "#555555",
                fontWeight: 500,
            }}
        >
            Loading activities...
        </span>
        <style>{`
      @keyframes pulse {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
      }
    `}</style>
    </div>
);

export default LoadingSpinner;
