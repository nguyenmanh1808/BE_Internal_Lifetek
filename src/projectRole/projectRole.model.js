const mongoose = require("mongoose");
const ROLES = require("../constants/index"); // Đường dẫn điều chỉnh nếu cần

const projectRoleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  role: {
    type: Number,
    enum: Object.values(ROLES), // [1, 2, 3]
    default: ROLES.USER,        // 3
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
});

projectRoleSchema.index({ userId: 1 });
projectRoleSchema.index({ projectId: 1 });

module.exports = mongoose.model("ProjectRole", projectRoleSchema);