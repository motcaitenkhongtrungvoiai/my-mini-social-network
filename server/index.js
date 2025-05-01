const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

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

app.listen(3000,() =>{
    console.log("sever is runing")
})
