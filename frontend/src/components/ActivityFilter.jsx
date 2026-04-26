import React, { useCallback } from "react";

const ACTIVITY_TYPES = [
    { value: "", label: "All Activities" },
    { value: "USER_LOGIN", label: "🔑 User Login" },
    { value: "USER_LOGOUT", label: "🚪 User Logout" },
    { value: "DOCUMENT_CREATED", label: "📄 Doc Created" },
    { value: "DOCUMENT_UPDATED", label: "✏️ Doc Updated" },
    { value: "DOCUMENT_DELETED", label: "🗑️ Doc Deleted" },
    { value: "COMMENT_ADDED", label: "💬 Comment" },
    { value: "TASK_ASSIGNED", label: "📋 Task Assigned" },
    { value: "TASK_COMPLETED", label: "✅ Task Done" },
    { value: "PROFILE_UPDATED", label: "👤 Profile" },
    { value: "TEAM_MEMBER_ADDED", label: "➕ Member Added" },
    { value: "TEAM_MEMBER_REMOVED", label: "➖ Member Removed" },
    { value: "REPORT_GENERATED", label: "📊 Report" },
    { value: "SETTING_CHANGED", label: "⚙️ Settings" },
];


const ActivityFilter = React.memo(({ activeFilter, onFilterChange }) => {
    const handleClick = useCallback(
        (value) => {
            onFilterChange(value || null);
        },
        [onFilterChange]
    );

    return (
        <div
            style={{
                padding: "16px 24px",
                borderBottom: "1px solid #1a1a1a",
                background: "#050505",
            }}
        >
            <div
                style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#555555",
                    marginBottom: "10px",
                }}
            >
                Filter by Type
            </div>
            <div
                style={{
                    display: "flex",
                    gap: "6px",
                    overflowX: "auto",
                    paddingBottom: "4px",
                    scrollbarWidth: "none",
                }}
            >
                {ACTIVITY_TYPES.map((type) => {
                    const isActive = (activeFilter || "") === type.value;
                    return (
                        <button
                            key={type.value}
                            onClick={() => handleClick(type.value)}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "20px",
                                border: isActive
                                    ? "1px solid #ffffff"
                                    : "1px solid #222222",
                                background: isActive ? "#ffffff" : "#0a0a0a",
                                color: isActive ? "#000000" : "#888888",
                                fontSize: "12px",
                                fontWeight: 500,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s ease",
                                fontFamily: "inherit",
                                outline: "none",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.borderColor = "#444444";
                                    e.currentTarget.style.color = "#cccccc";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.borderColor = "#222222";
                                    e.currentTarget.style.color = "#888888";
                                }
                            }}
                        >
                            {type.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
});

ActivityFilter.displayName = "ActivityFilter";
export default ActivityFilter;
