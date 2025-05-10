
const comment = require("../model/comment");
const  mongoose=require("mongoose");

const commentController = {
 
    createComment:async(req,res)=>{
    try{
    const comment= new comment({
        post:req.body.post,
        user:req.body.user,
        text:req.body.text,        
    });
   const createcoment= await comment.save();
   res.status(200).json(createcoment);
    if (!comment){
        throw new Error ("comment not found");       
    }

    }
    catch (err){
        console.log(err);
        res.status(500).json({message:err.message});
    }

    },

}
module.exports=commentController;