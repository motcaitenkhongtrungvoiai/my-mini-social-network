const mongoose = require("mongoose");
const post = require("../model/post");
const { create } = require("../model/user");

const postController = {
  createPost: async (req, res) => {
    try {
      const userId = req.params.id;

      const imageFiles = req.files?.postDoc;
      const imagePath =
        imageFiles && imageFiles.length > 0
          ? `/access/${imageFiles[0].filename}`
          : null;

      let typePost = imagePath ? "photoPost" : "textPost";

      if (!req.body.content && !imagePath) {
        return res.status(400).json({ message: "Bài viết trống." });
      }

      const newPost = new post({
        user: userId,
        content: req.body.content,
        typePost: typePost,
        image: imagePath,
      });

      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },

  updatePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const updatedPost = await post.findByIdAndUpdate(
        postId,
        { content: req.body.content },
        { new: true, runValidators: true }
      );
      if (!updatedPost) {
        throw new Error("Post not found");
      }
      res.status(200).json(updatedPost);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },

  deletePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const deletedPost = await post.findByIdAndDelete(postId);
      if (!deletedPost) {
        throw new Error("Post not found");
      }
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
  getPosts: async (req, res) => {
    try {
      const posts = await post
        .find()
        .populate("user", "username avatar")
        .lean();

      const postsWithCounts = posts.map((p) => ({
        ...p,
        likeCount: p.likes?.length || 0,
        commentCount: p.comments?.length || 0,
      }));

      res.status(200).json(postsWithCounts);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
  profilePosts: async (req, res) => {
    try {
      const userId = req.params.id;
      const posts = await post.find({ user: userId });
      res.status(200).json(posts);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.body._id;
      if (!postId || !userId) {
        throw new Error("Post ID and User ID are missing");
      }
      const postUpdateLike = await post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
      if (!postUpdateLike) {
        res.status(200).json(postUpdateLike);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = postController;
