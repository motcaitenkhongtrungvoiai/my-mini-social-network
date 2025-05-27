const router = require('express').Router();
const middleware= require(`../middleware/middlewareController`);
const comment= require(`../controllers/commentController`);
const middlewareController = require('../middleware/middlewareController');

router.post("/:postId",middlewareController.verifyTokenAndtoken,comment.createComment);
router.get("/:postId",comment.getComment);
router.put("/:commentId",middlewareController.verifyTokenAndtoken,comment.updateComment);
router.delete("/:commentId",middlewareController.verifyTokenAndtoken,comment.deleteComment);

module.exports=router;
