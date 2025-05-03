const { get } = require("mongoose");
const user=require("../model/user");

const userController={


    getAllUsers:async(req,res)=>{
        try {
            const users = await user.find();
            res.status(200).json(users);
        } catch (err) {
            console.log(err);
            res.status(500).json({message:err.message});
        }
    },


    getUser:async(req,res)=>{
       try {
       let id =req.params.id;
       let userData = await user.findById(id);
       if(!userData){
           return res.status(404).json({message:"User not found"});
       }
     res.status(200).json(userData);
    }
       catch (err) {
           console.log(err);
           res.status(500).json({message:err.message});
       }
    },


    updateUser:async(req,res)=>{
        try {
            let id =req.params.id;
            let userData=await user.findByIdAndUpdate(id,req.body,{new:true});
            if(!userData){
                return res.status(404).json({message:"User not found"});
            }   
            res.status(200).json(userData);
    }catch (err) {
            console.log(err);
            res.status(500).json({message:err.message});
        }},


    deleteUser:async(req,res)=>{
        try {
            let id =req.params.id;
            let userData=await user.findByIdAndDelete(id);
            if(!userData){
                return res.status(404).json({message:"User not found"});
            }
            res.status(200).json({message:"User deleted successfully"});
        } catch (err) {
            console.log(err);
            res.status(500).json({message:err.message});
        }
    },
    
    followUser:async(req,res)=>{
        try {
            let id =req.params.id;
            //lấy id của người mình muốn follow sau đó lấy token của mình để nhét vào cho họ
            let userData=await user.findByIdAndUpdate(id,{$addToSet:{followers:req.body.userId}},{new:true});
            if(!userData){
                return res.status(404).json({message:"User not found"});
            }   
            res.status(200).json(userData);
        }catch (err) {
            console.log(err);
            res.status(500).json({message:err.message});
        }},
    
 /*  
  getFollowers:async(req,res)=>{
        try {
            let id =req.params.id;
            let userData=await user.findById(id).populate("followers");
            if(!userData){
                return res.status(404).json({message:"User not found"});
            }   
            res.status(200).json(userData.followers);
        }catch (err) {
            console.log(err);
            res.status(500).json({message:err.message});
        }}

    */       

}
module.exports=userController;