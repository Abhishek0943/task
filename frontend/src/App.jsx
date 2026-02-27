import ActivityFeed from "./components/ActivityFeed";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        padding: "40px 20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto 32px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            margin: "0 0 8px",
            letterSpacing: "-0.03em",
            color: "#ffffff",
          }}
        >
          HR Portal
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#888888",
            margin: 0,
            fontWeight: 400,
          }}
        >
          Tenant-Isolated Activity Feed System
        </p>
      </div>

      <ActivityFeed />
    </div>
  );
}

export default App;
