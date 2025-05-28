const mongoose = require("mongoose");
const post = require("../model/post");
const user = require("../model/user");
const comment = require("../model/comment");

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
      const postId = req.params.idPost;
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
      const postId = req.params.idPost;
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
        .sort({ createdAt: -1 })
        .lean();

      const result = posts.map((post) => {
        const host = process.env.HOST_URL;

        const avatar =
          post.user.avatar && post.user.avatar.startsWith("/access/")
            ? host + post.user.avatar
            : host + "/access/default.png";

        const image =
          post.image && post.image.startsWith("/access/")
            ? host + post.image
            : null;
        return {
          _id: post._id,
          user: {
            _id: post.user._id,
            username: post.user.username,
            avatar: avatar,
          },
          codeSnippets: post.codeSnippets,
          content: post.content,
          link: post.link,
          type: post.typePost,
          image: image,
          likedPostIds: post.likes,
          comment: post.comment,
          likeCount: post.likes?.length || 0,
          commentCount: post.comments?.length || 0,
        };
      });

      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },

  profilePosts: async (req, res) => {
    try {
      const userId = req.params.userId;
      const posts = await post
        .find({ user: userId })
        .populate("user", "username avatar")
        .sort({ createdAt: -1 })
        .lean();

      const result = posts.map((post) => {
        const host = process.env.HOST_URL;

        const avatar =
          post.user.avatar && post.user.avatar.startsWith("/access/")
            ? host + post.user.avatar
            : host + "/access/default.png";

        const image =
          post.image && post.image.startsWith("/access/")
            ? host + post.image
            : null;
        return {
          _id: post._id,
          user: {
            _id: post.user._id,
            username: post.user.username,
            avatar: avatar,
          },
          content: post.content,
          link: post.link,
          type: post.typePost,
          image: image,
          likedPostIds: post.likes,
          comment: post.comment,
          likeCount: post.likes?.length || 0,
          commentCount: post.comments?.length || 0,
        };
      });

      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const postId = req.params.idPost;
      const userId = req.body.userId;

      if (!postId || !userId) {
        return res
          .status(400)
          .json({ message: "Post ID and User ID are required" });
      }

      const postData = await post.findById(postId);
      if (!postData) {
        return res.status(404).json({ message: "Post not found" });
      }

      let updatedPost;

      if (postData.likes.includes(userId)) {
        updatedPost = await post.findByIdAndUpdate(
          postId,
          { $pull: { likes: userId } }, // Xoá like
          { new: true }
        );
      } else {
        updatedPost = await post.findByIdAndUpdate(
          postId,
          { $addToSet: { likes: userId } }, // Thêm like
          { new: true }
        );
      }

      return res.status(200).json(updatedPost);
    } catch (err) {
      console.error("Lỗi like/unlike:", err);
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = postController;
