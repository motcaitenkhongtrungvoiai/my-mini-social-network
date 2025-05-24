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

  deleteOldImage : (imagePath) => {
  if (!imagePath) return;

  const filename = path.basename(imagePath); 
  const defaultImages = ["default.png", "default-avatar.png", "default-cover.png"];

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

    const updatedUser = await user.findByIdAndUpdate(id, updateData, { new: true });
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

  // theo dõi người khác
  followUser: async (req, res) => {
    // bug số 4 : bản thân có thể follow chính mình NHIỀU lần :)) bug follow vô hạn :v
    // bug số 5 : fans id không có trong database vân có thể follow idol :v
    // bug số 6 : thế quái nào mà nó lại có null trong test case nhỉ ??????? (chưa tìm ra ly do) Lú quá :v
    try {
      const idolId = req.body.idolId;
      const fansId = req.body._id;

      if (
        !idolId ||
        !fansId ||
        !mongoose.Types.ObjectId.isValid(idolId) ||
        !mongoose.Types.ObjectId.isValid(fansId)
      ) {
        return res.status(400).json({ message: "Invalid user ID(s)" });
      }

      // Không cho tự follow chính mình
      if (idolId === fansId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }

      const fans = await user.findById(fansId);
      if (!fans) {
        return res.status(404).json({ message: "Fan not found" });
      }

      const idolhasfans = await user.findByIdAndUpdate(
        idolId,
        { $addToSet: { followers: fansId } },
        { new: true }
      );

      if (!idolhasfans) {
        return res.status(404).json({ message: "add follower crash" });
      }
      // Cập nhật danh sách người theo dõi của fan
      const fanshasidol = await user.findByIdAndUpdate(
        fansId,
        { $addToSet: { following: idolId } },
        { new: true }
      );
      if (!fanshasidol) {
        return res.status(404).json({ message: "add following crash" });
      }
      res.status(200).json({ message: "follow success" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },

  //bỏ theo dõi
  unfollowUser: async (req, res) => {
    try {
      const idolId = req.body.idolId;
      const fansId = req.body._id;
      let userData = await user.findByIdAndUpdate(
        idolId,
        { $pull: { followers: fansId } },
        { new: true }
      );
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(userData);
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

      res.status(200).json({
        followers: userWithFollowers.followers,
      });
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
        followers: userWithFollowers.followers,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
};
module.exports = userController;
