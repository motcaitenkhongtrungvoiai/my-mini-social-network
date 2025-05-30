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

// Fuzzy search cho Post
 fuzzySearchPosts : async (req, res) => {
  const { keyword } = req.query;
  if (!keyword) return res.status(400).json({ message: "Missing keyword" });

  try {
    const posts = await Post.find().populate("user", "username").lean();
    const fuse = new Fuse(posts, {
      keys: ["content", "codesnippets", "user.username"],
      threshold: 1.2,
    });

    const results = fuse.search(keyword);
    const matchedPosts = results.map((r) => r.item);

    res.status(200).json(matchedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
}
module.exports = searchController;
