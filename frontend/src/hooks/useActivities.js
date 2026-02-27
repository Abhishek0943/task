import { useState, useEffect, useCallback, useRef } from "react";
import { fetchActivities as fetchActivitiesAPI } from "../utils/api";

/**
 * Custom hook for managing activities with cursor-based pagination.
 * Handles fetching, infinite scroll state, and type filtering.
 *
 * @param {string|null} typeFilter - Optional activity type to filter by
 * @returns {Object} - { activities, loading, error, hasMore, loadMore, addOptimisticActivity, refreshFeed }
 */
const useActivities = (typeFilter = null) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    // Track if we've done the initial load
    const initialLoadDone = useRef(false);
    // Track current filter to detect changes
    const prevFilter = useRef(typeFilter);

    /**
     * Fetch a page of activities from the API
     */
    const fetchPage = useCallback(
        async (cursorValue = null, isInitial = false) => {
            if (isInitial) {
                setInitialLoading(true);
            } else {
                setLoading(true);
            }
            setError(null);

            try {
                const result = await fetchActivitiesAPI(cursorValue, 20, typeFilter);
                const newActivities = result.data || [];

                if (isInitial) {
                    setActivities(newActivities);
                } else {
                    setActivities((prev) => [...prev, ...newActivities]);
                }

                setCursor(result.nextCursor);
                setHasMore(result.hasMore);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                setInitialLoading(false);
            }
        },
        [typeFilter]
    );

    /**
     * Load more activities (for infinite scroll)
     */
    const loadMore = useCallback(() => {
        if (!loading && !initialLoading && hasMore && cursor) {
            fetchPage(cursor, false);
        }
    }, [loading, initialLoading, hasMore, cursor, fetchPage]);

    /**
     * Refresh the entire feed (reset and fetch from the beginning)
     */
    const refreshFeed = useCallback(() => {
        setActivities([]);
        setCursor(null);
        setHasMore(true);
        fetchPage(null, true);
    }, [fetchPage]);

    /**
     * Optimistic UI: Add a new activity to the top of the feed immediately.
     * Returns a rollback function in case the server call fails.
     */
    const addOptimisticActivity = useCallback((tempActivity) => {
        setActivities((prev) => [tempActivity, ...prev]);

        // Return rollback function
        return () => {
            setActivities((prev) =>
                prev.filter((a) => a._id !== tempActivity._id)
            );
        };
    }, []);

    /**
     * Replace a temporary optimistic activity with the real server data
     */
    const replaceOptimisticActivity = useCallback((tempId, realActivity) => {
        setActivities((prev) =>
            prev.map((a) => (a._id === tempId ? realActivity : a))
        );
    }, []);

    // Initial fetch and re-fetch when filter changes
    useEffect(() => {
        if (!initialLoadDone.current || prevFilter.current !== typeFilter) {
            initialLoadDone.current = true;
            prevFilter.current = typeFilter;
            setActivities([]);
            setCursor(null);
            setHasMore(true);
            fetchPage(null, true);
        }
    }, [typeFilter, fetchPage]);

    return {
        activities,
        loading,
        initialLoading,
        error,
        hasMore,
        loadMore,
        addOptimisticActivity,
        replaceOptimisticActivity,
        refreshFeed,
    };
};

export default useActivities;
