const  ProjectRole  = require("./projectRole.model.js");

const createProjectRole = async (data) => {
  const projectRole = new ProjectRole(data);
  return await projectRole.save();
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

module.exports = {
  createProjectRole,
  getAllProjectRoles,
  getProjectRoleById,
  updateProjectRole,
  deleteProjectRole,
};