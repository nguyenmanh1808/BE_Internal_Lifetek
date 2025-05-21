const ProjectRole = require("./projectRole.model");
const mongoose = require('mongoose');


exports.createRole = async (data) => {
  return await ProjectRole.create(data);
};

exports.getRolesByProject = async (projectId) => {
  return await ProjectRole.find({ projectId }).populate("userIds");
};

exports.updateRole = async (roleId, updateData) => {
  return await ProjectRole.findByIdAndUpdate(roleId, updateData, { new: true });
};

exports.deleteRoles = async (roleIds) => {
  return await ProjectRole.deleteMany({ _id: { $in: roleIds } });
};


exports.addUsersToRole = async (roleId, userIds) => {
  return await ProjectRole.findByIdAndUpdate(
    roleId,
    { $addToSet: { userIds: { $each: userIds } } },
    { new: true }
  );
};

exports.removeUsersFromRole = async (roleId, userIds) => {
  if (!mongoose.Types.ObjectId.isValid(roleId)) {
    throw new Error('Role ID không hợp lệ');
  }
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error('Danh sách userIds không hợp lệ');
  }

  return await ProjectRole.findByIdAndUpdate(
    roleId,
    { $pull: { userIds: { $in: userIds } } },
    { new: true }
  );
};
