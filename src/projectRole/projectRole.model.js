const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PROJECT_ROLE_PERMISSIONS = [
  "View",
  "Add",
  "Edit",
  "Delete",
  "Comment",
];

const projectRoleSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  roleName: { type: String, required: true },
  description: { type: String },
  userIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
  permissions: [String],
}, { timestamps: true });

projectRoleSchema.index({ projectId: 1, roleName: 1 }, { unique: true });

// Validate permissions before save
projectRoleSchema.pre('save', function(next) {
  if (this.permissions) {
    const invalidPerms = this.permissions.filter(p => !PROJECT_ROLE_PERMISSIONS.includes(p));
    if (invalidPerms.length > 0) {
      return next(new Error(`Invalid permissions: ${invalidPerms.join(', ')}`));
    }
  }
  next();
});

// Validate permissions before findOneAndUpdate (including findByIdAndUpdate)
projectRoleSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.permissions) {
    // update.permissions có thể là mảng hoặc object $set, xử lý để lấy đúng mảng
    let perms = update.permissions;
    if (typeof perms === 'object' && !Array.isArray(perms)) {
      // Trường hợp $set: { permissions: [...] }
      perms = perms.$set || perms;
    }
    if (!Array.isArray(perms)) {
      return next(new Error('Permissions must be an array'));
    }
    const invalidPerms = perms.filter(p => !PROJECT_ROLE_PERMISSIONS.includes(p));
    if (invalidPerms.length > 0) {
      return next(new Error(`Invalid permissions: ${invalidPerms.join(', ')}`));
    }
  }
  next();
});

module.exports = mongoose.model("ProjectRole", projectRoleSchema);
