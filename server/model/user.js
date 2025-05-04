const mongoose = require("mongoose");

// tạo schema cho user

const userSchema = new mongoose.Schema(
  {
   
    username: { type: String, required: true, unique: true, minlength: 5 },
    email: { type: String, required: true, unique: true, trip: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,'Please provide a valid email'] },
    password: { type: String, required: true, minlength: 5 },
    avatar: { type: String, default: "../access/default.png" },
    coverphoto: { type: String, default: "../access/default.png" },
    profileDesc: { type: String, default: "Hello, I'm new here" ,maxlength: 500},
    website: { type: String},//đường dẫn đến trang cá nhân khác của người dùng chăng?
    //xác thực người dùng hai lần có thể thêm vai trò mới . nhưng admin vẫn phải là admin :))
    //ai Láo thì bock tài khoản cho nó thành criminal :v
    role: { type: String, enum: ["user", "admin","criminal"], default: "user" },
    admin: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
