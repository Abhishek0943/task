import React, { useState, useCallback, useEffect, useRef } from "react";
import useActivities from "../hooks/useActivities";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import ActivityItem from "./ActivityItem";
import ActivityFilter from "./ActivityFilter";
import CreateActivity from "./CreateActivity";
import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

const ActivityFeed = () => {
    const [typeFilter, setTypeFilter] = useState(null);

    const {
        activities,
        loading,
        initialLoading,
        error,
        hasMore,
        loadMore,
        addOptimisticActivity,
        replaceOptimisticActivity,
        refreshFeed,
    } = useActivities(typeFilter);

    const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading && !initialLoading);

    const pollingRef = useRef(null);

    useEffect(() => {
        pollingRef.current = setInterval(() => {
            refreshFeed();
        }, 30000);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, [refreshFeed]);

    const handleFilterChange = useCallback((filter) => {
        setTypeFilter(filter);
    }, []);

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "720px",
                margin: "0 auto",
                borderRadius: "16px",
                overflow: "hidden",
                background: "#000000",
                border: "1px solid #1a1a1a",
                boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
        >
            <div
                style={{
                    padding: "24px 24px 0",
                    borderBottom: "1px solid #1a1a1a",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize: "20px",
                                fontWeight: 700,
                                color: "#ffffff",
                                margin: 0,
                                letterSpacing: "-0.02em",
                            }}
                        >
                            Activity Feed
                        </h2>
                        <p
                            style={{
                                fontSize: "13px",
                                color: "#666666",
                                margin: "4px 0 0",
                            }}
                        >
                            {activities.length} activities loaded
                            {typeFilter && ` · Filtered`}
                        </p>
                    </div>
                    <button
                        onClick={refreshFeed}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "10px",
                            border: "1px solid #222222",
                            background: "#0a0a0a",
                            color: "#888888",
                            fontSize: "13px",
                            fontWeight: 500,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#444444";
                            e.currentTarget.style.color = "#cccccc";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#222222";
                            e.currentTarget.style.color = "#888888";
                        }}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            <CreateActivity
                addOptimisticActivity={addOptimisticActivity}
                replaceOptimisticActivity={replaceOptimisticActivity}
            />

            <ActivityFilter
                activeFilter={typeFilter}
                onFilterChange={handleFilterChange}
            />

            {error && (
                <div
                    style={{
                        margin: "16px 24px",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        background: "#111111",
                        border: "1px solid #333333",
                        color: "#aaaaaa",
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <span style={{ fontSize: "18px" }}>⚠️</span>
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                            Error loading activities
                        </div>
                        <div style={{ color: "#888888", fontSize: "12px" }}>{error}</div>
                    </div>
                </div>
            )}

            <div
                style={{
                    maxHeight: "600px",
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255,255,255,0.1) transparent",
                }}
            >
                {initialLoading && <LoadingSpinner />}

                {!initialLoading && activities.length === 0 && !error && (
                    <EmptyState hasFilter={!!typeFilter} />
                )}

                {activities.map((activity) => (
                    <ActivityItem key={activity._id} activity={activity} />
                ))}

                {hasMore && !initialLoading && (
                    <div ref={sentinelRef}>
                        {loading && <LoadingSpinner />}
                    </div>
                )}

                {!hasMore && activities.length > 0 && (
                    <div
                        style={{
                            padding: "24px",
                            textAlign: "center",
                            color: "#444444",
                            fontSize: "13px",
                            fontWeight: 500,
                        }}
                    >
                        — You've reached the end —
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
