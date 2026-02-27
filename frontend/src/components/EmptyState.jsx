
const EmptyState = ({ hasFilter }) => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 24px",
            textAlign: "center",
        }}
    >
        <div
            style={{
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: "#111111",
                border: "1px solid #222222",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                marginBottom: "20px",
            }}
        >
            {hasFilter ? "🔍" : "📭"}
        </div>
        <h3
            style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "8px",
                margin: "0 0 8px 0",
            }}
        >
            {hasFilter ? "No matching activities" : "No activities yet"}
        </h3>
        <p
            style={{
                fontSize: "14px",
                color: "#666666",
                lineHeight: 1.6,
                maxWidth: "320px",
                margin: 0,
            }}
        >
            {hasFilter
                ? "Try changing the filter or clearing it to see all activities."
                : "Activities will appear here as they happen. Create one using the form above!"}
        </p>
    </div>
);

export default EmptyState;
