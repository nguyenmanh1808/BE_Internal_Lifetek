const express = require("express");
const taskController = require("./task.controller.js");
const upload = require("../config/multer.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const checkPermissions = require("../middlewares/checkProjectRole.middleware.js");
const routerTask = express.Router();

routerTask.use(authMiddleware);

routerTask.param("taskId", taskController.load);

routerTask.route("/")
  .get(taskController.getAllTasks)
  .post(
    upload.single("image"),
    checkPermissions(['Add']),
    taskController.addTask
  )
  .delete(taskController.deleteManyTask);

routerTask.route("/:taskId")
  .get(taskController.getTaskById)
  .put(
    upload.single("image"),
    taskController.updateTask
  )
  .delete(
    checkPermissions(['Delete']),
    taskController.deleteTask
  );


routerTask.put("/:taskId/status", taskController.updateTaskStatus);
routerTask.get("/project/:projectId", taskController.getAllTaskByProject);
routerTask.post("/:taskId/add-user", taskController.addUserToTaskController);
routerTask.post("/filter/:projectId", taskController.filterTaskController);
routerTask.get("/search/:projectId", taskController.searchTaskByTitle);
routerTask.post("/:taskId/update-type", taskController.updateType);

module.exports = routerTask;
