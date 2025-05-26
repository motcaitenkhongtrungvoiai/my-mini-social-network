const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require('http');
const { Server } = require('ws');

// import routes
const authRouter = require("./routes/auth");
const userRouter = require("./routes/usersRouter");
const postRouter = require("./routes/postRouter");
const commentRouter= require("./routes/comment");

const notificationSocket=require('./routes/ws/notificationSocket');

dotenv.config();
const app = express();
const server=http.createServer(app);
const wss = new Server({server});

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
app.use("/v1/post",postRouter);
app.use("/v1/comment",commentRouter);
app.use('/access', express.static(path.join(__dirname, 'access')));

// tạo server
app.listen(3000,() =>{
    console.log("sever is runing")
})
