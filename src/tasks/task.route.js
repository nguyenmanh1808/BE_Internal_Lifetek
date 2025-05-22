const express = require("express");
const routerTask = express.Router();

const taskController = require("./task.controller");
const upload = require("../config/multer");
const authMiddleware = require("../middlewares/auth.middleware");
const checkPermissions = require("../middlewares/checkProjectRole.middleware");

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
    checkPermissions(['Edit']),
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
