const Notification = require("./notification.model.js");
 
 exports.getAllNotifi = async (skip, limit) => {
   return await Notification.find()
     .skip(skip)
     .limit(limit)
     .populate("userId", "userName email avatar");
 };
 
 exports.countNotifi = async () => {
   return await Notification.countDocuments();
 };
 
 exports.FindNotifiByUserId = async (userId) => {
   return await Notification.find({ userId})
       .populate("userId","userName email avatar") // Chỉ lấy user name và email của user});
 }

exports.deleteNotifi = async (id) => {
   return await Notification.findByIdAndDelete(id);
}
 
exports.updateIsRead = async (id) => {
  console.log(id)
  const noti = Notification.findById(id);
  if (noti.isRead == true) {
      throw new Error("Không thể cập nhật trạng thái.");
  }
  return await Notification.findByIdAndUpdate(id,{ $set: { isRead: true } }, { new: true })
}
exports.deleteAllNotifi = async () => {
  try {
    const result = await Notification.deleteMany({});
    return result;
  } catch (error) {
    throw new Error('Không thể xóa tất cả thông báo');
  }
};