const tenantIsolation = (req, res, next) => {
    const tenantId = req.headers["x-tenant-id"];
    if (!tenantId || typeof tenantId !== "string" || tenantId.trim() === "") {
        return res.status(400).json({
            success: false,
            error: "Missing or invalid x-tenant-id header. Tenant isolation is mandatory.",
        });
    }
    req.tenantId = tenantId.trim();
    next();
};

module.exports = tenantIsolation;
