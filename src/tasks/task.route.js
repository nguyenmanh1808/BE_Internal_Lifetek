const express = require("express");
const taskController = require("./task.controller.js");
const upload = require("../config/multer.js");
const authMiddleware = require("../middlewares/auth.middleware.js"); // Đảm bảo đường dẫn đúng
const checkProjectPermissions = require("../middlewares/checkProjectRole.middleware.js"); // Đảm bảo đường dẫn đúng

const routerTask = express.Router();

// Áp dụng middleware xác thực cho tất cả các route task
routerTask.use(authMiddleware);

// Middleware để load task và gán vào req.task cho các route có :taskId
routerTask.param("taskId", taskController.load);

routerTask
  .route("/")
  .get(taskController.getAllTasks)
  .post(
    upload.single("image"),
    checkProjectPermissions(['Add']), // Cần quyền 'Add' để tạo task
    taskController.addTask
  )
  .delete(
    // checkProjectPermissions(['Delete']), // Xóa nhiều task cần logic phức tạp hơn trong controller/service
    taskController.deleteManyTask // Tạm thời giữ nguyên, cần review logic quyền cho chức năng này
  );

routerTask
  .route("/:taskId")
  .get(taskController.getTaskById) // Bỏ checkProjectPermissions(['View'])
  .put(
    upload.single("image"),
    checkProjectPermissions(['Edit']), // Cần quyền 'Edit' để cập nhật task
    taskController.updateTask
  )
  // .post(taskController.addUserToTaskController) // Route này đã được định nghĩa lại bên dưới là /:taskId/add-user
  .delete(
    checkProjectPermissions(['Delete']), // Cần quyền 'Delete' để xóa task
    taskController.deleteTask
  );

routerTask.put(
  "/:taskId/status",
  taskController.updateTaskStatus // Quyền được xử lý bởi workflowService bên trong controller
);
routerTask.get(
  "/project/:projectId",
  taskController.getAllTaskByProject // Bỏ checkProjectPermissions(['View'])
);
routerTask.post(
  "/:taskId/add-user",
  // checkProjectPermissions(['Edit']), // Hoặc một quyền 'AssignTask' nếu có
  taskController.addUserToTaskController // Hiện tại đang dùng PERMISSIONS global, cân nhắc tích hợp
);
routerTask.post(
  "/filter/:projectId",
  taskController.filterTaskController // Bỏ checkProjectPermissions(['View'])
);
routerTask.get(
  "/search/:projectId",
  taskController.searchTaskByTitle // Bỏ checkProjectPermissions(['View'])
);
routerTask.post(
  "/:taskId/update-type",
  // checkProjectPermissions(['Edit']), // Hoặc một quyền 'ManageTaskType' nếu có
  taskController.updateType // Hiện tại đang dùng PERMISSIONS global, cân nhắc tích hợp
);

// Nếu bạn có route để comment, ví dụ:
// routerTask.post(
//   "/:taskId/comments",
//   checkProjectPermissions(['Comment']),
//   commentController.createComment // Giả sử có commentController
// );

module.exports = routerTask;
