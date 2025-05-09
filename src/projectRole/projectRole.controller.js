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

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};