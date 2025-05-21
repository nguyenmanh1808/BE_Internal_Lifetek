const express = require("express");
const router = express.Router();
const controller = require("./projectRole.controller");
const mongoose = require('mongoose');

// Tạo vai trò mới cho project
router.post("/", controller.createRole);

// Lấy tất cả vai trò trong 1 project
router.get("/project/:projectId", controller.getRolesByProject);

// Cập nhật vai trò (tên, mô tả, quyền,...)
router.put("/:roleId", controller.updateRole);

// Xoá vai trò
router.delete("/", controller.deleteRoles);

// Thêm người dùng vào vai trò
router.post("/:roleId/add-users", controller.addUsersToRole);

// Xoá người dùng khỏi vai trò
router.delete("/:roleId/remove-users", controller.removeUsersFromRole);

module.exports = router;
