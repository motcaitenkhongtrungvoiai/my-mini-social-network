const mongoose = require('mongoose');
const post = require('../model/post');
const { create } = require('../model/user');

const postController = {
  
    createPost:async(req,res)=>{
        try {
           const newPost = new post(req.body);
           const savedPost = await newPost.save();
           res.status(200).json(savedPost);
        }
        catch (err) {
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
            const postId = req.body._id;
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
    myPosts:async(req,res)=>{
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
        const postId = req.body._id;
        const userId = req.body.use;
       }
       catch (err) {
            console.log(err);
            res.status(500).json({ message: err.message });
        }
       }
}

module.exports = postController;
