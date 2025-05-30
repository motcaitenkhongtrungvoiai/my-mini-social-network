const mongoose = require("mongoose");
const user = require("../model/user");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const userController = {
  /*
CACH THUC CUA USER VA ADMIN LIEN QUAN DEN USER
    -- tạm thời không cấp quyền tạo người dùng mới cho admin chỉ dùng tài khoản bên đã đăng ký để test vì chưa có phương thức xác minh 
    verfine email :v
    -- sau này sẽ thêm vào
    -- các phương thức của người dùng : + hiển thị toàn bộ danh sách người dùng
                                        + hiển thị danh sách người theo dõi
                                        + hiển thị danh sách mình đang theo dõi
                                        + theo dõi người khác
                                        + bỏ theo dõi người khác
                                        + tìm kiếm người dùng
                                        + cập nhật thông tin người dùng
                                        + xóa người dùng => chỉ admin và chủ tài khoản mới xóa :v

    -- các phương thức của admin : + hiển thị toàn bộ danh sách người dùng
                                   + xóa người dùng tùy ý
                                   + cập nhật thông tin người dùng tùy ý => ai Láo thì bock tài khoản.
    -- còn gì nữa không nhỉ?

    */
  getAllUsers: async (req, res) => {
  try {
    const users = await user.find();
    const totalUsers = users.length;

    const formattedUsers = users.map(u => {
      const { password, admin, ...other } = u._doc;
      other.avatar = u.avatar.startsWith("/access/")
        ? process.env.HOST_URL + u.avatar
        : process.env.HOST_URL + "/access/default.png";
      other.coverphoto = u.coverphoto.startsWith("/access/")
        ? process.env.HOST_URL + u.coverphoto
        : process.env.HOST_URL + "/access/default.png";
      return other;
    });

    res.status(200).json({ totalUsers, users: formattedUsers });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
  },


changeUserRole: async (req, res) => {
  try {
    const requesterId = req.body.requesterId; 
    const targetUserId = req.params.promoteId; 
    const newRole = req.body.newRole;

    if (!["user", "admin", "criminal"].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const requester = await user.findById(requesterId);
    if (!requester || requester.role !== "admin") {
      return res.status(403).json({ message: "admin mới có quyền đổi " });
    }

    if (requesterId === targetUserId) {
      return res.status(400).json({ message: "bạn không thể tự ý đổi quyền " });
    }

    const targetUser = await user.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "không tìm thất người dùng " });
    }

    if (targetUser.role === "admin" && newRole === "criminal") {
      return res.status(400).json({ message: "Cannot downgrade admin to criminal" });
    }

    targetUser.role = newRole;
    await targetUser.save();

    res.status(200).json({ message: `User role updated to ${newRole}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
},



  getUser: async (req, res) => {
    try {
      let id = req.params.userId;
      let userData = await user.findById(id);
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, admin, ...other } = userData._doc;
      other.followerCount = userData.followers?.length || 0;
      other.followingCount = userData.following?.length || 0;
      other.avatar = userData.avatar.startsWith("/access/")
        ? process.env.HOST_URL + userData.avatar
        : process.env.HOST_URL + "/access/default.png";

      other.coverphoto = userData.coverphoto.startsWith("/access/")
        ? process.env.HOST_URL + userData.coverphoto
        : process.env.HOST_URL + "/access/default.png";

      res.status(200).json(other);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },

  deleteOldImage: (imagePath) => {
    if (!imagePath) return;

    const filename = path.basename(imagePath);
    const defaultImages = [
      "default.png",
      "default-avatar.png",
      "default-cover.png",
    ];

    if (defaultImages.includes(filename)) return;

    const fullPath = path.join(__dirname, "../access", filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Đã xóa ảnh cũ: ${filename}`);
    } else {
      console.warn(`Ảnh cần xóa không tồn tại: ${fullPath}`);
    }
  },

  updateUser: async (req, res) => {
    try {
      const id = req.params.id;

      const userData = await user.findById(id);
      if (!userData) return res.status(404).json({ message: "User not found" });

      const updateData = { ...req.body };

      // Avatar
      if (req.files?.avatar?.[0]) {
        userController.deleteOldImage(userData.avatar); 
        updateData.avatar = "/access/" + req.files.avatar[0].filename;
      }

      
      if (req.files?.coverphoto?.[0]) {
        userController.deleteOldImage(userData.coverphoto); // xóa cover cũ
        updateData.coverphoto = "/access/" + req.files.coverphoto[0].filename;
      }

      const updatedUser = await user.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      let id = req.params.id;
      let userData = await user.findByIdAndDelete(id);
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },

  toggleFollowUser: async (req, res) => {
  try {
    const idolId = req.params.idolId;
    const fansId = req.user._id;

    if (!idolId || !fansId ||  !mongoose.Types.ObjectId.isValid(idolId) ||  !mongoose.Types.ObjectId.isValid(fansId) )
   {
      return res.status(400).json({ message: "Invalid user -userId" });
    }

    const idol = await user.findById(idolId);
    const fan = await user.findById(fansId);

    if (!idol || !fan) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFollowing = idol.followers.includes(fansId);

    if (alreadyFollowing) {
      // Nếu đã follow => unfollow
      await user.findByIdAndUpdate(idolId, { $pull: { followers: fansId } });
      await user.findByIdAndUpdate(fansId, { $pull: { following: idolId } });
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      // Nếu chưa follow => follow
      await user.findByIdAndUpdate(idolId, { $addToSet: { followers: fansId } });
      await user.findByIdAndUpdate(fansId, { $addToSet: { following: idolId } });
      return res.status(200).json({ message: "Followed successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
},

  getFollowers: async (req, res) => {
  try {
    const idolId = req.user._id;
    const host = process.env.HOST_URL;

    const userWithFollowers = await user.findById(idolId).populate({
      path: "followers",
      select: "username avatar _id",
    }).lean();

    if (!userWithFollowers) {
      return res.status(404).json({ message: "User not found" });
    }

    const followersWithHostAvatar = userWithFollowers.followers.map((follower) => {
      const avatar = follower.avatar && follower.avatar.startsWith("/access/")
        ? host + follower.avatar
        : host + "/access/default.png";

      return {
        _id: follower._id,
        username: follower.username,
        avatar: avatar,
      };
    });

    res.status(200).json(followersWithHostAvatar);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
},

getFollowing: async (req, res) => {
  try {
    const fanId = req.user._id;
    const host = process.env.HOST_URL;

    const userWithFollowing = await user.findById(fanId).populate({
      path: "following",
      select: "username avatar _id",
    }).lean();

    if (!userWithFollowing) {
      return res.status(404).json({ message: "User not found" });
    }

    const followingWithHostAvatar = userWithFollowing.following.map((followed) => {
      const avatar = followed.avatar && followed.avatar.startsWith("/access/")
        ? host + followed.avatar
        : host + "/access/default.png";

      return {
        _id: followed._id,
        username: followed.username,
        avatar: avatar,
      };
    });

    res.status(200).json(followingWithHostAvatar);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
},

};
module.exports = userController;
