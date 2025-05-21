const ProjectRole = require("./projectRole.model");

exports.createRole = async (data) => {
  return await ProjectRole.create(data);
};

exports.getRolesByProject = async (projectId) => {
  return await ProjectRole.find({ projectId }).populate("userIds");
};

exports.updateRole = async (roleId, updateData) => {
  return await ProjectRole.findByIdAndUpdate(roleId, updateData, { new: true });
};

exports.deleteRole = async (roleId) => {
  return await ProjectRole.findByIdAndDelete(roleId);
};

exports.addUsersToRole = async (roleId, userIds) => {
  return await ProjectRole.findByIdAndUpdate(
    roleId,
    { $addToSet: { userIds: { $each: userIds } } },
    { new: true }
  );
};

exports.removeUsersFromRole = async (roleId, userIds) => {
  return await ProjectRole.findByIdAndUpdate(
    roleId,
    { $pull: { userIds: { $in: userIds } } },
    { new: true }
  );
};
