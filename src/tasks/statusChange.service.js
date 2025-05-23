const JobStatusChange = require("./task_status_change.model.js");
const Task = require("./task.model.js");
const User = require("../users/user.model.js")
const Notification = require('../notifications/notification.model.js');
const { sendNotification } = require("../socket.js");
const updateTaskStatusService = async (taskId, oldStatus, newStatus, userId, reason, notes, changeSource) => {
  const task = await Task.findById(taskId);
  const user = await User.findById(userId)
  if (!task) {
    throw new Error("Không tìm thấy công việc!");
  }

  task.status = newStatus;
  await task.save();
  // thông báo
  task.assigneeId = [...task.assigneeId, task.assignerId];
  const message = `${user.userName} đã cập nhật trạng thái công việc: ${task.title}`;
  task.assigneeId.forEach(async (userId) => { 
    if (userId != user._id) {
            const notification = new Notification({
                  userId,
                  projectId:task.projectId,
                  taskId,
                  type: "task_update_status",
                  message:`${user.userName} đã cập nhật trạng thái công việc: ${task.title}`,
            });
            await notification.save();
              // Gửi thông báo qua WebSockets
            sendNotification(userId, message);
    }
    else if (userId == user._id || task.assignerId == user._id) {
      const notification = new Notification({
                  userId,
                  projectId:task.projectId,
                  taskId,
                  type: "task_update_status",
                  message:`Bạn đã cập nhật trạng thái công việc: ${task.title}`,
            });
            await notification.save();
              // Gửi thông báo qua WebSockets
            sendNotification(userId, message);
    }
    })
 
    const data = {
        taskId,
        projectId: task.projectId,
        oldStatus,
        newStatus,
        changedBy: userId,
        reason,
        notes,
        changeSource,
    }
  await JobStatusChange.create(data);

  return task;
};

module.exports = {updateTaskStatusService};
