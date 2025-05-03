const mongoose = require(`mongoose`);

const postSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    desc:{
        type:String,
        maxlength:3000,
    },
    link:{type:String},
    img:{type:String},
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    comment:{
        type:String,
        maxlength:500,
    }

},{
    timestamps:true,
})

module.exports = mongoose.model(`post`,postSchema);