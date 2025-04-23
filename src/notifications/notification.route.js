const express = require("express");

const { getAllNotifiByUserId, deleteNotifi, handleSubscription, sendTestNotification, updateIsRead, deleteAllNotifi } = require("./notification.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

const routerNotification = express.Router();

routerNotification
  .route("/all")
  .delete(authMiddleware, deleteAllNotifi);
routerNotification
  .route("/")
  .get(getAllNotifiByUserId);

routerNotification
  .route("/:id")
  .delete(deleteNotifi)
  .put(updateIsRead);

routerNotification
  .route("/subscribe")
  .post(handleSubscription)
  .get(sendTestNotification)


module.exports = routerNotification;

