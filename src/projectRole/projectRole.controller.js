const service = require("./projectRole.service");

const create = async (req, res) => {
  try {
    const role = await service.createProjectRole(req.body);
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ message: "Create failed", error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const roles = await service.getAllProjectRoles();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: "Get all failed", error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const role = await service.getProjectRoleById(req.params.id);
    if (!role) return res.status(404).json({ message: "Not found" });
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({ message: "Get by ID failed", error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const role = await service.updateProjectRole(req.params.id, req.body);
    if (!role) return res.status(404).json({ message: "Not found" });
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const role = await service.deleteProjectRole(req.params.id);
    if (!role) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
const batchAddUsersToProject = async (req, res) => {
  try {
    const { userIds, projectId, role } = req.body;

    if (!userIds || !Array.isArray(userIds) || !projectId || role === undefined) {
      return res.status(400).json({ message: 'Missing userIds, projectId or role' });
    }

    const roles = await service.batchAddUsersToProject(userIds, projectId, role);

    res.status(201).json({ message: 'Users added successfully', data: roles });
  } catch (err) {
    res.status(500).json({ message: "Batch add failed", error: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const projectRoles = await service.getProjectById(req.params.projectId);
    if (!projectRoles || projectRoles.length === 0) return res.status(404).json({ message: "Project not found" });

    res.status(200).json(projectRoles);
  } catch (err) {
    res.status(500).json({ message: "Get project by ID failed", error: err.message });
  }
};

const removeUserRoleInProject = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    if (!projectId || !userId) {
      return res.status(400).json({ message: "Missing projectId or userId" });
    }

    const result = await service.removeUserRoleInProject(userId, projectId);

    if (!result) {
      return res.status(404).json({ message: "User role not found in this project" });
    }

    res.status(200).json({ message: "User role removed from project successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove user role in project", error: err.message });
  }
};

const removeRoleFromUsersInProjectController = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userIds, role } = req.body;  // role là number

    if (!projectId || !userIds || role === undefined) {
      return res.status(400).json({ message: "Missing projectId, userIds or role" });
    }

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "userIds must be a non-empty array" });
    }

    if (typeof role !== 'number') {
      return res.status(400).json({ message: "role must be a number" });
    }

    const result = await service.removeRoleFromUsersInProject(userIds, role, projectId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No matching user roles found to remove" });
    }

    res.status(200).json({ message: "Roles removed successfully", deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove roles", error: err.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  getProjectById,
  batchAddUsersToProject,
  removeUserRoleInProject,
  removeRoleFromUsersInProjectController,
};