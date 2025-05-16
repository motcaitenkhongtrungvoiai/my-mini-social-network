const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const middlewareController = {
  // Tạo Access Token
  createToken: (user) => {
    return jwt.sign(
      { _id: user._id, isAdmin: user.admin, role: user.role },
      process.env.KEY_token,
      { expiresIn: process.env.TOKEN_EXPIRES_IN }
    );
  },

  // Tạo Refresh Token
  createRefreshToken: (user) => {
    return jwt.sign(
      { _id: user._id, isAdmin: user.admin, role: user.role },
      process.env.KEY_refresh_token,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
  },

  // Kiểm tra Access Token
  verifyToken: (req, res, next) => {
    const authHeader = req.headers.token;

    if (!authHeader) {
      return res.status(401).json({ message: "Bạn chưa xác thực!" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.KEY_token, (err, decodedUser) => {
      if (err) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
      }

      req.user = decodedUser; // Lưu thông tin user vào request để dùng ở các bước sau
      next();
    });
  },

  // Kiểm tra người dùng chính chủ hoặc là admin
  verifyTokenAndAuthorization: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      const requestUserId = req.body._id || req.params.id|| req.body.userId;

      if (
        (req.user._id === requestUserId && req.user.role==="user" )||
        (req.user.isAdmin && req.user.role === "admin")
      ) {
        next();
      } else {
        return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này!" });
      }
    });
  },

  // Chỉ cho admin
  verifyTokenAndAdmin: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      if (req.user.isAdmin && req.user.role === "admin") {
        next();
      } else {
        return res.status(403).json({ message: "Chỉ admin mới được phép thực hiện!" });
      }
    });
  },
};

module.exports = middlewareController;
