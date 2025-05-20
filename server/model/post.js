const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    maxlength: 5000
  },
  image: {
    // có thể đổi sang array nếu muốn thêm multi Image
    type: String
  },
  link:[{
    type:String,
  }],
  typePost:{
    type:String,
    enum:["textPost", "photoPost"],
    default:"textPost"
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, { timestamps: true });


PostSchema.pre('save', function (next) {
  if (this.content) {
    // 1. Tìm link URL và lưu vào mảng `link`
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundLinks = this.content.match(urlRegex);
    this.link = foundLinks || [];
    this.content = this.content.replace(/\n/g, '<br>');
  }
  next();
});


module.exports = mongoose.model('Post', PostSchema);