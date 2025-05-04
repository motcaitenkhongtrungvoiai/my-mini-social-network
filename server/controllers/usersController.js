const mongoose = require("mongoose");
const user = require("../model/user");

const userController = {
  /*
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
      let id = req.params.id;
      let userData = await user.findById(id);
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      let id = req.params.id;
      let userData = await user.findByIdAndUpdate(id, req.body, { new: true });
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(userData);
    } catch (err) {
      console.log(err);
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
      let idol = req.params.id;
      let fans = await user.findById(req.body.userId); //đây là id của người dùng hiện tại đang đăng nhập

      if (
        !idol ||
        !fans ||
        !mongoose.Types.ObjectId.isValid(fans) ||
        !mongoose.Types.ObjectId.isValid(idol)
      ) {
        return res.status(500).json({ message: "server has something weird" });
      }

      let userData = await user.findByIdAndUpdate(
        idol,

        { $addToSet: { followers: fans } },
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

  //bỏ theo dõi
  unfollowUser: async (req, res) => {
    try {
      let id = req.params.id;
      //lấy id của người mình muốn unfollow sau đó lấy ID token của mình để nhét vào cho họ
      let userData = await user.findByIdAndUpdate(
        id,
        { $pull: { followers: req.body.userId } },
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
      let id = req.params.id;
      let userData = await user.findById(id).populate("followers");
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(userData.followers);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
  // hiển thị dang sach mình đang theo dõi
  getFollowing: async (req, res) => {
    try {
      let id = req.params.id;
      let userData = await user.findById(id).populate("following");
      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(userData.following);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
};
module.exports = userController;
