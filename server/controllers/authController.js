const User = require("../model/user");
const bcrypt = require("bcrypt");

const authController = {
  registerUser: async (req, res) => {
    try {
      //debug 1 :: kiểm tra xem có dữ liệu gửi lên hay không
      console.log("dữ liệu đang gửi lên từ client", req.body);

      //bug 1 : genSalt quá nhiều khiến máy bị treo :V
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        //bug 2 :: đóng gói sai dữ liệu :<
       
      });
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
  LoginUser:async (req,res) => {
 try{
  const user = await User.findOne({username:req.body.username});
  if(!user) return res.status(404).json({message:"không tìm thấy tài khoản"});
  const isMatch = await bcrypt.compare(req.body.password,user.password);
  if(!isMatch) return res.status(400).json({message:"sai tài khoản hoặc mật khẩu"});
  if(user && isMatch){
    const {password,...others} = user._doc;
    res.status(200).json(others);
  }
 }
 catch(err){
  console.log(err); 
  res.status(500).json({ message: "lỗi đăng nhập sever" });
  }}
};
module.exports = authController;
