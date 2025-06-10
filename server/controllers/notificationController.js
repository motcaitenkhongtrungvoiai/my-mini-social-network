const comment = require("../model/comment");
const Notification = require("../model/notification");
const mongoose = require("mongoose");
const Post = require("../model/post");

const notificationController = {
  // func này dành cho soket. không lên đụng vào
  initNotification: async ({ recipient, sender, type, post, comment }) => {
    try {
      const checkNoice = await Notification.findOne({
        sender: sender,
        recipient: recipient,
        post: post,
        type: type,
      }).lean();
      if (checkNoice) {
        return;
      } else {
        const newNotice = await Notification.create({
          recipient,
          sender,
          type,
          post,
          comment,
        });
        return newNotice;
      }
    } catch (err) {
      console.error("\n noice wrong insert!!", err);
      return null;
    }
  },

  getNotification: async (req, res) => {
    try {
      const host = process.env.HOST_URL;
      const userId = new mongoose.Types.ObjectId(req.user._id);
      if (!userId) {
        throw new Error("không lấy được người nhận");
      }
      const groupNoti = await Notification.aggregate([
        {
          $match: {
            recipient: userId,
          },
        },
        {
          $group: {
            _id: {
              read: "$read",
              type: "$type",
              post: "$post",
            
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.read": 1, // false lên trước
            count: -1,
          },
        },
      ]);

      const populated = await Promise.all(
        groupNoti.map(async (item) => {
          let image = null;
          if (item._id.post) {
            const post = await Post.findById(item._id.post).select("image");
            if (post?.image) {
              image = host + `${post.image}`;
            }
          }
          return {
            ...item,
            image,
          };
        })
      );

      return res.status(200).json(populated);
    } catch (err) {
      console.log("không lấy được thông tin:" + err);
    }
  },
  delNotification: async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id);
      const { post, type, read } = req.body;

      if (!userId || !type) {
        throw new Error("Không đủ thông tin để xóa");
      }

      const query = {
        recipient: userId,
        type,
        post,
        read,
      };

      const del = await Notification.deleteMany(query);
      return res.status(200).json(del);
    } catch (err) {
      console.log("không xóa được thông báo:", err);
      return res.status(500).json({ error: "Lỗi server khi xóa thông báo" });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id);
      const update = await Notification.updateMany(
        { recipient: userId },
        { $set: { read: true } }
      );
      return res.status(200).json(update);
    } catch (err) {
      console.log("không cập nhật được thông báo:", err);
      return res
        .status(500)
        .json({ error: "Lỗi server khi cập nhật thông báo" });
    }
  },
};
module.exports = notificationController;
