const User = require("../model/user");
const Post = require("../model/post");
const Fuse = require("fuse.js");

const searchController ={
fuzzySearchUsers : async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ message: "Missing keyword" });

  try {
    const users = await await User.find({}, "_id avatar username").lean();
    const fuse = new Fuse(users, {
      keys: ["username"],
      threshold: 0.6, 
    });

    const results = fuse.search(keyword);
    const matchedUsers = results.map((r) => r.item);

    res.status(200).json(matchedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

fuzzySearchPosts: async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ message: "Missing keyword" });

  try {
    const host = process.env.HOST_URL;

    const posts = await Post.find()
      .populate("user", "username avatar")
      .lean();

    const fuse = new Fuse(posts, {
      keys: ["content", "codesnippets", "user.username"],
      threshold: 0.6,
    });

    const results = fuse.search(keyword);

    const matchedPosts = results.map((r) => {
      const post = r.item;

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
        code: post.codesnippets || "",
        content: post.content || "",
        link: post.link || [],
        type: post.typePost || "textPost",
        image: image,
        likedPostIds: post.likes || [],
        comment: post.comment || null,
        likeCount: post.likes?.length || 0,
        commentCount: post.comments?.length || 0,
      };
    });

    res.status(200).json(matchedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}


}
module.exports = searchController;
