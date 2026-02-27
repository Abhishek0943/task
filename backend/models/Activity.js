const mongoose = require("mongoose");
const activitySchema = new mongoose.Schema(
  {
    tenantId: {
      type: String,
      required: [true, "tenantId is required for tenant isolation"],
      index: true,
    },
    actorId: {
      type: String,
      required: [true, "actorId is required"],
    },
    actorName: {
      type: String,
      required: [true, "actorName is required"],
    },
    type: {
      type: String,
      required: [true, "Activity type is required"],
      enum: [
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
      ],
    },
    entityId: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false, 
    versionKey: false,
  }
);
activitySchema.index({ tenantId: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
