const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

// import routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/usersRouter");
const postRouter = require("./routes/postRouter");

dotenv.config();
const app = express();

mongoose.connect(process.env.connectionString,).then(()=>{
  console.log("connect database");  
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});


app.use(cors());
app.use(cookieParser());
app.use(express.json());


// routers
app.use("/v1/auth",authRouter);
app.use("/v1/users",userRouter);
app.use("v1/post",postRouter);
app.use("v1/comment",)
app.use('/access', express.static(path.join(__dirname, 'access')));

// tạo server
app.listen(3000,() =>{
    console.log("sever is runing")
})
