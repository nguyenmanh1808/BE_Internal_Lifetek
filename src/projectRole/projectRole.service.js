const ProjectRole = require("./projectRole.model.js");

const createProjectRole = async (data) => {
  const projectRole = new ProjectRole(data);
  return await projectRole.save();
};

const batchAddUsersToProject = async (userIds, projectId, role) => {
  const roles = userIds.map(userId => ({
    userId,
    projectId,
    role,
  }));

  return await ProjectRole.insertMany(roles);
};

const getAllProjectRoles = async () => {
  return await ProjectRole.find().populate("userId").populate("projectId");
};

const getProjectRoleById = async (id) => {
  return await ProjectRole.findById(id).populate("userId").populate("projectId");
};

const updateProjectRole = async (id, data) => {
  return await ProjectRole.findByIdAndUpdate(id, data, { new: true });
};

const deleteProjectRole = async (id) => {
  return await ProjectRole.findByIdAndDelete(id);
};

const getProjectById = async (projectId) => {
  try {
    // Tìm tất cả ProjectRole với projectId, sau đó populate userId
    const projectRoles = await ProjectRole.find({ projectId })
      .populate('userId', 'name email');  // Populate các trường của User (ví dụ: name và email)

    if (!projectRoles || projectRoles.length === 0) {
      throw new Error("Project not found");
    }
    
    return projectRoles;  // Trả về các vai trò của dự án
  } catch (error) {
    throw error;
  }
};

const removeUserRoleInProject = async (userId, projectId) => {
  try {
    // Tìm và xoá vai trò của user trong dự án
    const result = await ProjectRole.findOneAndDelete({ userId, projectId });

    return result;  // Trả về kết quả (hoặc null nếu không tìm thấy)
  } catch (error) {
    throw new Error('Error while removing user role in project');
  }
};

module.exports = {
  createProjectRole,
  getAllProjectRoles,
  getProjectRoleById,
  updateProjectRole,
  deleteProjectRole,
  batchAddUsersToProject,
  getProjectById,
  removeUserRoleInProject,
};