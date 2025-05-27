const comment = require("../model/comment");
const post = require("../model/post");
const mongoose = require("mongoose");

const commentController = {
  // Tạo bình luận mới
  createComment: async (req, res) => {
    try {
      const postId = req.params.postId;
      const { userId, content, parentId } = req.body;

      const newComment = new comment({
        postId,
        userId,
        content,
        parentId: parentId || null,
      });

      const savedComment = await newComment.save();

      await post.findByIdAndUpdate(postId, {
        $push: { comments: savedComment._id },
      });

      res.status(201).json(savedComment);
    } catch (err) {
      console.error("Lỗi tạo comment:", err);
      res.status(500).json({ message: err.message });
    }
  },

  getComment: async (req, res) => {
    const postId = req.params.postId;
    const host = process.env.HOST_URL;

    try {
      const comments = await comment
        .find({ postId })
        .sort({ createdAt: 1 })
        .populate("userId", "username avatar");

      const map = {};
      comments.forEach((c) => {
        const commentObj = c.toObject();

        // Xử lý avatar
        const avatar = commentObj.userId.avatar;
        commentObj.userId.avatar =
          avatar && avatar.startsWith("/access/")
            ? host + avatar
            : host + "/access/default.png";

        map[c._id] = { ...commentObj, replies: [] };
      });

      const roots = [];
      comments.forEach((c) => {
        if (c.parentId) {
          map[c.parentId]?.replies.push(map[c._id]);
        } else {
          roots.push(map[c._id]);
        }
      });

      res.json(roots);
    } catch (err) {
      console.error("Lỗi getComment:", err);
      res.status(500).json({ message: err.message });
    }
  },

  deleteComment: async (req, res) => {
    const commentId = req.params.commentId;
    try {
      const mainComment = await comment.findById(commentId);
      if (!mainComment)
        return res.status(404).json({ message: "Comment not found" });

      const findAllChildComments = async (parentId) => {
        const children = await comment.find({ parentId });
        let ids = [];
        for (let child of children) {
          ids.push(child._id);
          const childIds = await findAllChildComments(child._id);
          ids = ids.concat(childIds);
        }
        return ids;
      };

      const allChildrenIds = await findAllChildComments(commentId);

      await comment.deleteMany({
        _id: { $in: [commentId, ...allChildrenIds] },
      });

      await post.findByIdAndUpdate(mainComment.postId, {
        $pull: { comments: commentId },
      });

      res.json({ message: "Comment deleted successfully" });
    } catch (err) {
      console.error("Lỗi deleteComment:", err);
      res.status(500).json({ message: err.message });
    }
  },

  // Cập nhật nội dung bình luận
  updateComment: async (req, res) => {
    const commentId = req.params.commentId;
    const content = req.body.content;
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
      console.error("Lỗi updateComment:", err);
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = commentController;
