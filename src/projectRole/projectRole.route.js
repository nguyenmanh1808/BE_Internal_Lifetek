const express = require("express");
const controller = require("./projectRole.controller");

const router = express.Router();

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/project/:projectId", controller.getProjectById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.post("/batch/", controller.batchAddUsersToProject);
router.delete('/project/:projectId/user/:userId/role', controller.removeUserRoleInProject);


module.exports = router;