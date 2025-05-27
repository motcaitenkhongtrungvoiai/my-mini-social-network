const { appendFileSync } = require("fs");
const comment = require("../model/comment");
const post = require("../model/post");
const mongoose = require("mongoose");

const commentController = {
  createComment: async (req, res) => {
    try {
      const postId= req.params.postId;
      const { userId, content, parentId } = req.body;
      const comment = new comment({
        postId,
        userId,
        content,
        parentId: parentId || null,
      });
      const savedComment = await comment.save();
      // lưu xong thì nhét id lại cho post
      await post.findByIdAndUpdate(postId, {
        $push: { comments: savedComment._id },
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },

  getComment: async (req, res) => {
    const postId = req.params.postId;
    try {
      const comments = await comment
        .find({ postId })
        .sort({ createdAt: 1 })
        .populate("userId", "username avatar");
      const map = {};
      comments.forEach((c) => (map[c._id] = { ...c.toObject(), replies: [] }));
      const roots = [];
      comment.forEach((c) => {
        if (c.parentId) {
          map[c.parentId]?.replies.push(map[c._id]);
        } else {
          roots.push(map[c._id]);
        }
      });
      res.json(roots);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },

  deleteComment: async (req, res) => {
    const { commentId } = req.params.commentId;
    try {
      const mainComment = await comment.findById(commentId);
      if (!mainComment)
        return res.status(404).json({ message: "Comment not found" });

      await comment.deleteMany({
        $or: [{ _id: commentId }, { parentId: commentId }],
      });

      await post.findByIdAndUpdate(mainComment.postId, {
        $pull: { comments: commentId },
      });

      res.json({ message: "Comment deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  updateComment: async (req, res) => {
    const { commentId } = req.params.commentId;
    const { content } = req.body.content;
    try {
      const updated = await comment.findByIdAndUpdate(
        commentId,
        { content },
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ message: "Comment not found" });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
module.exports = commentController;
