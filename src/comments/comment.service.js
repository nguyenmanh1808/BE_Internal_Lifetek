const Comment = require("./comment.model.js");
const Task = require("../tasks/task.model.js");
const User = require("../users/user.model.js")
const { sendNotification } = require("../socket.js");
const Notification = require('../notifications/notification.model.js');
exports.createComment = async (data) => {
  try {
    if (!data.taskId || !data.userId || !data.content) {
      throw new Error("Thiếu dữ liệu bắt buộc");
    }
    const task = await Task.findById(data.taskId);
    const user = await User.findById(data.userId )
    const comment = await Comment.create(data);
    // thông báo
    task.assigneeId = [...task.assigneeId, task.assignerId];
      const message = `${user.userName} đã thêm bình luận vào công việc: ${task.title}`;
      task.assigneeId.forEach(async (userId) => { 
        if (data.userId != userId) {
            const notification = new Notification({
                            userId,
                            projectId: task.projectId,
                            taskId:task._id,
                            type: "new_comment",
                            message:`${user.userName} đã thêm bình luận vào công việc ${task.title}`,
                      });
                      await notification.save();
                        // Gửi thông báo qua WebSockets
                      sendNotification(userId, message);
          }
        })
    return comment;
  } catch (error) {
    throw new Error("Không thể tạo bình luận. Vui lòng thử lại." + error.message);
  }
};
exports.getAllcmt = async (taskId, skip, limit) => {
  try {
    const comments = await Comment.find({ taskId: taskId })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "userId",
        select: "userName avatar email ",
      });
    return comments;
  } catch (error) {
    throw new Error("Không thể lấy bình luận. Vui lòng thử lại." + error.message);
  }
};
exports.countComment = async (taskId) => {
  try {
    const total = await Comment.countDocuments({ taskId: taskId });
    return total;
  }
  catch (error) {
    throw new Error("Không thể đếm bình luận. Vui lòng thử lại." + error.message);
  }
};
