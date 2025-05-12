const { appendFileSync } = require("fs");
const comment = require("../model/comment");
const mongoose = require("mongoose");
const comment = require("../model/comment");

const commentController = {
  createComment: async (req, res) => {
    const { postId, userId, content, parentId } = req.body;

    try {
      const comment = new comment({
        postId,
        userId,
        content,
        parentId: parentId || null,
      });
      await comment.save();
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
