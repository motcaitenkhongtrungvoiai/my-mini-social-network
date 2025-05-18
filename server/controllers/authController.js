const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const middlewareController = require("../middleware/middlewareController");

dotenv.config();

let refreshTokens = [];

const authController = {
  registerUser: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      console.log("Dữ liệu từ client:", req.body);

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập đầy đủ thông tin." });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ message: "Tên đăng nhập đã tồn tại." });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      const { password: pw, ...userWithoutPassword } = savedUser._doc;
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      console.error("Lỗi khi đăng ký:", err);
      res.status(500).json({ message: "Lỗi server khi đăng ký người dùng." });
    }
  },

  loginUser: async (req, res) => {
    try {
      const email = req.body.username || req.body.email;
      const password = req.body.password;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Vui lòng nhập username và password." });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy tài khoản." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Sai tài khoản hoặc mật khẩu." });
      }

      const accessToken = middlewareController.createToken(user);
      const refreshToken = middlewareController.createRefreshToken(user);
      refreshTokens.push(refreshToken);

      const { password: pw, ...userData } = user._doc;

      res.status(200).json({
        ...userData,
        accessToken,
        refreshToken,
      });
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      res.status(500).json({ message: "Lỗi server khi đăng nhập." });
    }
  },
};

module.exports = authController;
