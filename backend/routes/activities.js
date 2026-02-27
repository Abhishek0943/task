const express = require("express");
const Activity = require("../models/Activity");
const tenantIsolation = require("../middleware/tenantIsolation");

const router = express.Router();
router.use(tenantIsolation);
router.post("/", async (req, res) => {
    try {
        const { actorId, actorName, type, entityId, metadata } = req.body;
        if (!actorId || !actorName || !type) {
            return res.status(400).json({
                success: false,
                error: "actorId, actorName, and type are required fields.",
            });
        }
        const activity = new Activity({
            tenantId: req.tenantId,
            actorId,
            actorName,
            type,
            entityId: entityId || null,
            metadata: metadata || {},
            createdAt: new Date(),
        });

        // Use save() for single document — optimized for high write throughput
        const savedActivity = await activity.save();
        return res.status(201).json({
            success: true,
            data: savedActivity,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                error: error.message,
            });
        }

        console.error("[POST /activities] Error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Internal server error while creating activity.",
        });
    }
});
router.get("/", async (req, res) => {
    try {
        const { cursor, limit: rawLimit, type } = req.query;
        const limit = Math.min(Math.max(parseInt(rawLimit) || 20, 1), 100);
        const query = { tenantId: req.tenantId };
        if (cursor) {
            const cursorDate = new Date(cursor);
            if (isNaN(cursorDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid cursor format. Must be a valid ISO 8601 date string.",
                });
            }
            query.createdAt = { $lt: cursorDate };
        }
        if (type) {
            query.type = type;
        }
        const activities = await Activity.find(query)
            .select("tenantId actorId actorName type entityId metadata createdAt")
            .sort({ createdAt: -1 })
            .limit(limit + 1)
            .lean(); 
        const hasMore = activities.length > limit;
        const results = hasMore ? activities.slice(0, limit) : activities;
        const nextCursor =
            results.length > 0
                ? results[results.length - 1].createdAt.toISOString()
                : null;

        return res.status(200).json({
            success: true,
            data: results,
            nextCursor,
            hasMore,
        });
    } catch (error) {
        console.error("[GET /activities] Error:", error.message);
        return res.status(500).json({
            success: false,
            error: "Internal server error while fetching activities.",
        });
    }
});

module.exports = router;
