const { appendFileSync } = require("fs");
const comment = require("../model/comment");
const post = require("../model/post");
const mongoose = require("mongoose");

const commentController = {
  createComment: async (req, res) => {
    try {
      const { postId, userId, content, parentId } = req.body;
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
    const { postId } = req.params;
    try {
      const comments = await comment
        .find({ postId })
        .sort({ createdAt: 1 })
        .populate("userId", "username avatar");
      const map = {};
      comment.forEach((c) => (map[c._id] = { ...c.toObject(), replies: [] }));
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

  deleteComment: async (req, res) => {},

  updateComment: async (req, res) => {},
};
module.exports = commentController;
