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
exports.deleteRoles = async (req, res) => {
  try {
    const roleIds = req.body.roleIds; // ví dụ: [ "id1", "id2", "id3" ]
    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      return res.status(400).json({ error: "roleIds phải là mảng và không được rỗng" });
    }
    await service.deleteRoles(roleIds);
    res.status(200).json({ message: "Xóa thành công nhiều role" });
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
    await service.removeUsersFromRole(req.params.roleId, req.body.userIds);
    res.status(200).json({ message: "Xóa người dùng khỏi vai trò thành công" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

