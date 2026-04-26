const API_BASE = "http://localhost:5001";
const TENANT_ID = "tenant-001";
/**
 * Fetch activities with cursor-based pagination
 * @param {string|null} cursor - ISO date string for pagination
 * @param {number} limit - Number of activities to fetch
 * @param {string|null} typeFilter - Optional activity type filter
 * @returns {Promise<{data: Array, nextCursor: string|null, hasMore: boolean}>}
 */
export const fetchActivities = async (cursor = null, limit = 20, typeFilter = null) => {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    params.append("limit", String(limit));
    if (typeFilter) params.append("type", typeFilter);

    const response = await fetch(`${API_BASE}/activities?${params.toString()}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-tenant-id": TENANT_ID,
        },
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP ${response.status}`);
    }

    return response.json();
};

/**
 * Create a new activity
 * @param {Object} activityData - { actorId, actorName, type, entityId?, metadata? }
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const createActivity = async (activityData) => {
    const response = await fetch(`${API_BASE}/activities`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-tenant-id": TENANT_ID,
        },
        body: JSON.stringify(activityData),
    });

    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `HTTP ${response.status}`);
    }

    return response.json();
};
