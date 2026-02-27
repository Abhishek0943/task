import React from "react";

const ACTIVITY_TYPE_CONFIG = {
    USER_LOGIN: { icon: "🔑", label: "User Login" },
    USER_LOGOUT: { icon: "🚪", label: "User Logout" },
    DOCUMENT_CREATED: { icon: "📄", label: "Document Created" },
    DOCUMENT_UPDATED: { icon: "✏️", label: "Document Updated" },
    DOCUMENT_DELETED: { icon: "🗑️", label: "Document Deleted" },
    COMMENT_ADDED: { icon: "💬", label: "Comment Added" },
    TASK_ASSIGNED: { icon: "📋", label: "Task Assigned" },
    TASK_COMPLETED: { icon: "✅", label: "Task Completed" },
    PROFILE_UPDATED: { icon: "👤", label: "Profile Updated" },
    TEAM_MEMBER_ADDED: { icon: "➕", label: "Team Member Added" },
    TEAM_MEMBER_REMOVED: { icon: "➖", label: "Team Member Removed" },
    REPORT_GENERATED: { icon: "📊", label: "Report Generated" },
    SETTING_CHANGED: { icon: "⚙️", label: "Setting Changed" },
};


const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
};

/**
 * Single activity item in the feed.
 */
const ActivityItem = React.memo(({ activity }) => {
    const config = ACTIVITY_TYPE_CONFIG[activity.type] || {
        icon: "📌",
        label: activity.type,
    };

    const isOptimistic = activity._id?.startsWith("temp-");

    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "20px 24px",
                background: isOptimistic ? "#0a0a0a" : "transparent",
                borderBottom: "1px solid #1a1a1a",
                transition: "background 0.2s ease",
                opacity: isOptimistic ? 0.7 : 1,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "#0d0d0d";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = isOptimistic ? "#0a0a0a" : "transparent";
            }}
        >
            <div
                style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "#111111",
                    border: "1px solid #222222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0,
                }}
            >
                {config.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                        flexWrap: "wrap",
                    }}
                >
                    <span
                        style={{
                            fontWeight: 600,
                            fontSize: "14px",
                            color: "#ffffff",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {activity.actorName}
                    </span>
                    <span
                        style={{
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "#999999",
                            background: "#111111",
                            padding: "2px 10px",
                            borderRadius: "20px",
                            border: "1px solid #222222",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {config.label}
                    </span>
                    {isOptimistic && (
                        <span
                            style={{
                                fontSize: "11px",
                                color: "#666666",
                                fontStyle: "italic",
                            }}
                        >
                            sending...
                        </span>
                    )}
                </div>

                {/* Entity and Metadata */}
                {(activity.entityId || (activity.metadata && Object.keys(activity.metadata).length > 0)) && (
                    <div
                        style={{
                            fontSize: "13px",
                            color: "#777777",
                            marginBottom: "4px",
                            lineHeight: 1.5,
                        }}
                    >
                        {activity.entityId && (
                            <span>
                                on <span style={{ color: "#cccccc" }}>{activity.entityId}</span>
                            </span>
                        )}
                        {activity.metadata?.description && (
                            <span> — {activity.metadata.description}</span>
                        )}
                    </div>
                )}

                <span
                    style={{
                        fontSize: "12px",
                        color: "#555555",
                    }}
                >
                    {formatTimeAgo(activity.createdAt)}
                </span>
            </div>
        </div>
    );
});

ActivityItem.displayName = "ActivityItem";
export default ActivityItem;
