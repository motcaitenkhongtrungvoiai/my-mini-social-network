const router = require('express').Router();
const postController = require('../controllers/postController');
const middlewareController = require("../middleware/middlewareController");
const upload = require('../middleware/uploadImage');

router.post('/create',upload.single('image'),postController.createPost);
router.post('/update',postController.updatePost);
router.delete('/del/:_id',postController.deletePost);
router.post('/post',postController.getPosts);
router.get('/profile/:_id',postController.profilePosts);
router.put('/likePost/:_id',postController.likePost);

module.exports=router;