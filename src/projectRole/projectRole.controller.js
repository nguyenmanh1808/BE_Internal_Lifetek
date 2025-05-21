const service = require("./projectRole.service");

exports.createRole = async (req, res) => {
  try {
    const result = await service.createRole(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getRolesByProject = async (req, res) => {
  try {
    const result = await service.getRolesByProject(req.params.projectId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const result = await service.updateRole(req.params.roleId, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    await service.deleteRole(req.params.roleId);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.addUsersToRole = async (req, res) => {
  try {
    const result = await service.addUsersToRole(req.params.roleId, req.body.userIds);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.removeUsersFromRole = async (req, res) => {
  try {
    const result = await service.removeUsersFromRole(req.params.roleId, req.body.userIds);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
