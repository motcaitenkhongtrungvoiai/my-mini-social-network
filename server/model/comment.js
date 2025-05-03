const mongoose =require(`mongoose`);

const commentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    comment:{
        type:String,
        maxlength:500,
    },
    img:{
        type:String,
    },
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
},{
    timestamps:true,

})
module.exports = mongoose.model(`comment`,commentSchema);