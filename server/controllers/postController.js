const mongoose = require('mongoose');
const post = require('../model/post');
const { create } = require('../model/user');

const postController = {
  
    createPost:async(req,res)=>{
        try {
            const imagePath = req.file ? `/access/${req.file.filename}` : null;
            const newPost = new post({
              user: req.body.user,
              content: req.body.content,
              image: imagePath
            });
        
            const savedPost = await newPost.save();
            res.status(200).json(savedPost);
          } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
          }
    },

    updatePost:async(req,res)=>{
        try {
          const postId = req.body._id;
            const updatedPost = await post.findByIdAndUpdate(postId, {content: req.body.content}, { new: true,runValidators: true });
           if (!updatedPost) {
               throw new Error('Post not found');
            }
            res.status(200).json(updatedPost);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },
   
    deletePost:async(req,res)=>{
        try {
            const postId = req.params._id;
            const deletedPost = await post.findByIdAndDelete(postId);
            if (!deletedPost) {
                throw new Error('Post not found');
            }
            res.status(200).json({ message: 'Post deleted successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },
    getPosts:async(req,res)=>{
        try {
          const post =await post.find();
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },
    profilePosts:async(req,res)=>{
        try {
            const userId = req.params._id;
            const posts = await post.find({ user: userId });
            res.status(200).json(posts);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
    },
    likePost:async(req,res)=>{
       try {
        const postId = req.params._id;
        const userId = req.body._id;
        if (!postId || !userId) {
           throw new Error('Post ID and User ID are missing');
        }
        const postUpdateLike = await post.findByIdAndUpdate(postId, { $addToSet: { likes: userId } }, { new: true });
        if (!postUpdateLike) {
            throw new Error('Post not found');
        }
        
       }
       catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
       }
}

module.exports = postController;
