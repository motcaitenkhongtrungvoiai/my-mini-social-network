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
      res.status(200).json(users);
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

      const { password, admin, role, ...other } = userData._doc;
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
        userController.deleteOldImage(userData.avatar); // xóa avatar cũ
        updateData.avatar = "/access/" + req.files.avatar[0].filename;
      }

      // Coverphoto
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
    const fansId = req.body.userId;

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

  // hiển thị danh sách người theo dõi
  getFollowers: async (req, res) => {
    try {
      const idolId = req.body._id;
      const userWithFollowers = await user.findById(idolId).populate({
        path: "followers",
        select: "username avatar _id",
      });

      if (!userWithFollowers) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ followers: userWithFollowers.followers,});    
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
  // hiển thị dang sach mình đang theo dõi
  getFollowing: async (req, res) => {
    try {
      const fanId = req.body._id;
      const userWithFollowers = await user.findById(fanId).populate({
        path: "followeing",
        select: "username avatar _id",
      });

      if (!userWithFollowers) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        followers: userWithFollowing.following,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
};
module.exports = userController;
