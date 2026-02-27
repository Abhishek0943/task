import React, { useState, useCallback } from "react";
import { createActivity } from "../utils/api";

const ACTIVITY_TYPES = [
    "USER_LOGIN",
    "USER_LOGOUT",
    "DOCUMENT_CREATED",
    "DOCUMENT_UPDATED",
    "DOCUMENT_DELETED",
    "COMMENT_ADDED",
    "TASK_ASSIGNED",
    "TASK_COMPLETED",
    "PROFILE_UPDATED",
    "TEAM_MEMBER_ADDED",
    "TEAM_MEMBER_REMOVED",
    "REPORT_GENERATED",
    "SETTING_CHANGED",
];

const CreateActivity = ({ addOptimisticActivity, replaceOptimisticActivity }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        actorId: "",
        actorName: "",
        type: "DOCUMENT_CREATED",
        entityId: "",
        description: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = useCallback((field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null);
        setSuccess(false);
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!formData.actorId || !formData.actorName || !formData.type) {
                setError("Actor ID, Actor Name, and Type are required.");
                return;
            }

            setSubmitting(true);
            setError(null);
            setSuccess(false);

            const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const tempActivity = {
                _id: tempId,
                tenantId: "tenant-001",
                actorId: formData.actorId,
                actorName: formData.actorName,
                type: formData.type,
                entityId: formData.entityId || null,
                metadata: formData.description
                    ? { description: formData.description }
                    : {},
                createdAt: new Date().toISOString(),
            };

            const rollback = addOptimisticActivity(tempActivity);

            try {
                const result = await createActivity({
                    actorId: formData.actorId,
                    actorName: formData.actorName,
                    type: formData.type,
                    entityId: formData.entityId || undefined,
                    metadata: formData.description
                        ? { description: formData.description }
                        : undefined,
                });

                replaceOptimisticActivity(tempId, result.data);

                setSuccess(true);
                setFormData({
                    actorId: "",
                    actorName: "",
                    type: "DOCUMENT_CREATED",
                    entityId: "",
                    description: "",
                });

                setTimeout(() => setSuccess(false), 3000);
            } catch (err) {
                rollback();
                setError(`Failed to create activity: ${err.message}`);
            } finally {
                setSubmitting(false);
            }
        },
        [formData, addOptimisticActivity, replaceOptimisticActivity]
    );

    const inputStyle = {
        flex: 1,
        padding: "10px 14px",
        borderRadius: "10px",
        border: "1px solid #222222",
        background: "#0a0a0a",
        color: "#e0e0e0",
        fontSize: "13px",
        outline: "none",
        fontFamily: "inherit",
        transition: "border-color 0.2s ease",
    };

    return (
        <div
            style={{
                borderBottom: "1px solid #1a1a1a",
            }}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                style={{
                    width: "100%",
                    padding: "16px 24px",
                    background: "transparent",
                    border: "none",
                    color: "#cccccc",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: "inherit",
                    transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0a0a0a";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                }}
            >
                <span>✨ Create New Activity</span>
                <span
                    style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                        fontSize: "12px",
                    }}
                >
                    ▼
                </span>
            </button>

            {/* Form */}
            {isOpen && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        padding: "0 24px 20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <div style={{ display: "flex", gap: "12px" }}>
                        <input
                            type="text"
                            placeholder="Actor ID (e.g., user-123)"
                            value={formData.actorId}
                            onChange={(e) => handleChange("actorId", e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "#555555"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#222222"; }}
                        />
                        <input
                            type="text"
                            placeholder="Actor Name (e.g., John Doe)"
                            value={formData.actorName}
                            onChange={(e) => handleChange("actorName", e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "#555555"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#222222"; }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: "12px" }}>
                        <select
                            value={formData.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                            style={{
                                ...inputStyle,
                                cursor: "pointer",
                            }}
                        >
                            {ACTIVITY_TYPES.map((t) => (
                                <option key={t} value={t}>
                                    {t.replace(/_/g, " ")}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Entity ID (optional)"
                            value={formData.entityId}
                            onChange={(e) => handleChange("entityId", e.target.value)}
                            style={inputStyle}
                            onFocus={(e) => { e.currentTarget.style.borderColor = "#555555"; }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = "#222222"; }}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Description (optional metadata)"
                        value={formData.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "#555555"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "#222222"; }}
                    />

                    {error && (
                        <div
                            style={{
                                padding: "10px 14px",
                                borderRadius: "10px",
                                background: "#1a1a1a",
                                border: "1px solid #333333",
                                color: "#aaaaaa",
                                fontSize: "13px",
                            }}
                        >
                            ⚠️ {error}
                        </div>
                    )}

                    {success && (
                        <div
                            style={{
                                padding: "10px 14px",
                                borderRadius: "10px",
                                background: "#1a1a1a",
                                border: "1px solid #333333",
                                color: "#cccccc",
                                fontSize: "13px",
                            }}
                        >
                            ✅ Activity created successfully!
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                            padding: "12px 20px",
                            borderRadius: "10px",
                            border: "1px solid #333333",
                            background: submitting ? "#222222" : "#ffffff",
                            color: submitting ? "#666666" : "#000000",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: submitting ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            transition: "all 0.2s ease",
                            opacity: submitting ? 0.6 : 1,
                        }}
                        onMouseEnter={(e) => {
                            if (!submitting) {
                                e.currentTarget.style.background = "#e0e0e0";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!submitting) {
                                e.currentTarget.style.background = "#ffffff";
                            }
                        }}
                    >
                        {submitting ? "Creating..." : "Create Activity"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default CreateActivity;
