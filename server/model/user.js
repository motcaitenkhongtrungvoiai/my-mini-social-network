const mongoose = require("mongoose");

// tạo schema cho user
// Schema là một cấu trúc dữ liệu định nghĩa cách mà dữ liệu sẽ được lưu trữ trong MongoDB
const user = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 5 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 5 },
  avatar: { type: String, default: "../asscet/default.png" },
  bio: { type: String, default: "" },
  //xác thực người dùng
  role: { type: String, enum: ["user", "admin"], default: "user" },
  admin: { type: Boolean,default: false},

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  createdAt: { type: Date, default: Date.now },
});
