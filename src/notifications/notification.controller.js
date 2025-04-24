const mongoose = require("mongoose");
const SuccessResponse = require("../utils/SuccessResponse.js");
const PAGINATE = require("../constants/paginate.js");
const notifiService = require("./notification.service.js")
 const { webpush } = require('../config/webPushConfig.js');
exports.getAllNotifi = async (req, res, next) => {
   try {
     const page = parseInt(req.query.page) || PAGINATE.PAGE;
     const limit = parseInt(req.query.limit) || PAGINATE.LIMIT;
     const skip = (page - 1) * limit;
     const tasks = await notifiService.getAllNotifi(skip, limit);
     const total = await notifiService.countNotifi();
 
     return new SuccessResponse(tasks, 200, "success", total, page, limit).sends(res);
   } catch (error) {
     return next(error);
   }
};
 
exports.getAllNotifiByUserId = async (req, res, next) => {
   try {
    const  userId  = req.user._id;
    console.log(userId)
    const notifi = await notifiService.FindNotifiByUserId(userId);
 
    if (!notifi) return next(new Error("Thông báo không tồn tại"));
    return new SuccessResponse(notifi).send(res);
     
  } catch (error) {
    return next(error);
  }
}

exports.deleteNotifi = async (req, res, next) => {
   try {
      const notifiId = req.params.id;
      const notifi = await notifiService.deleteNotifi(notifiId);
      if (!notifi) return next(new Error(" Không tìm thấy thông báo"));
  
      return new SuccessResponse("Xóa thông báo thành công").send(res);
    } catch (error) {
      return next(error);
    }
}
let latestSubscription = null;

exports.handleSubscription = (req, res) => {

  const subscription = req.body;
  console.log(subscription)
  latestSubscription = subscription;

  const payload = JSON.stringify({
    title: '🚨 Thông báo từ Web App!',
    body: 'Đây là nội dung thông báo push gửi từ server Node.js!',
  });

  webpush.sendNotification(subscription, payload)
    .then(() => res.status(200).json({ message: 'Thông báo đã được gửi!' ,payload}))
    .catch(err => console.error(err));
};

exports.sendTestNotification = (req, res) => {
  if (!latestSubscription) {
    return res.status(400).json({ error: 'Chưa có subscription nào được ghi nhận.' });
  }

  const payload = JSON.stringify({
    title: '🧪 Đây là thông báo test',
    body: 'Bạn đã nhận được tin nhắn từ server!',
  });

  webpush.sendNotification(latestSubscription, payload)
    .then(() => res.status(200).json({ message: 'Thông báo test đã được gửi!', payload }))
    .catch(err => {
      console.error('Lỗi gửi thông báo test:', err);
      res.sendStatus(500);
    });
};

exports.updateIsRead = async (req, res,next) => {
  try {
    const { id } = req.params;
    const notifi = await notifiService.updateIsRead(id);
    if (!notifi) next(new Error("Thông báo không tìm thấy"));
    
    return new SuccessResponse(notifi).send(res);
  }
  catch (err) {
    return next(err)
  }

}

exports.deleteAllNotifi = async (req, res, next) => {
  try {
    // Gọi hàm xóa tất cả thông báo trong notifiService
    const result = await notifiService.deleteAllNotifi();

    if (!result.deletedCount) {
      return next(new Error('Không có thông báo nào để xóa'));
    }

    // Trả về phản hồi thành công
    return new SuccessResponse('Đã xóa tất cả thông báo').send(res);
  } catch (error) {
    return next(error);
  }
};