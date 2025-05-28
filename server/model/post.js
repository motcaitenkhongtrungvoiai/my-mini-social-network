const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      maxlength: 5000,
    },
    codeSnippets: {
      type: String,
      maxlength: 2000,
    },
    image: {
      type: String,
    },
    link: [
      {
        type: String,
      },
    ],

    typePost: {
      type: String,
      enum: ["textPost", "photoPost"],
      default: "textPost",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    beReport: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PostSchema.pre("save", function (next) {
  if (this.content) {
    // 1. Tìm link URL và lưu vào mảng `link`
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundLinks = this.content.match(urlRegex);
    this.link = foundLinks || [];
    this.content = this.content.replace(/\n/g, "<br>");
  }

  next();
});


module.exports = mongoose.model("Post", PostSchema);
