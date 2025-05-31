const Notification = require("../model/notification");
const mongoose = require("mongoose");
const notificationController = {
  // func này dành cho soket. không lên đụng vào
  initNotification: async ({ recipient, sender, type, post }) => {
    try {
      const newNotice = await Notification.create({
        recipient,
        sender,
        type,
        post,
      });
      return newNotice;
    } catch (err) {
      console.error("\n noice wrong insert!!", err);
      return null;
    }
  },
  // khi người dùng bật thanh thông báo thì thực  hiện lấy dữ liệu.
  getNotification: async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id);
      if (!userId) {
        throw new Error("không lấy được người nhận");
      }
      const groupNoti = await Notification.aggregate([
        {
          $match: {
            recipient: userId,
            read: false,
          },
        },
        {
          $group: {
            _id: {
              type: "$type",
              post: "$post",
            },
            notifications: { $push: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { "notifications.createdAt": -1 },
        },
      ]);

      return res.status(200).json(groupNoti);
    } catch (err) {
      console.log("không lấy được thông tin:" + err);
    }
  },
  delNoitification: async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id);
      const post = new mongoose.type.ObjectId(req.body.post);
      const type = req.body.type;
      if (!userId || !post) {
        throw new Error("không đủ thông tin để xóa ");
      }
      const del = await Notification.deleteMany({
        recipient: mongoose.Types.ObjectId("664eff6e31b9e53f56a8f111"),
        type: type,
        post: mongoose.Types.ObjectId("6650882a4018dd42cfb39222"),
      });

      return res.status(200).json(del);
    } catch (err) {
      console.log("không lấy được thông tin:" + err);
    }
  },
};
module.exports = notificationController;
