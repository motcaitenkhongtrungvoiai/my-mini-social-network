const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: { type:mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
