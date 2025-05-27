const router = require('express').Router();
const middleware= require(`../middleware/middlewareController`);
const comment= require(`../controllers/commentController`);
const middlewareController = require('../middleware/middlewareController');

router.post("/create",middlewareController.verifyTokenAndAuthorization,comment.createComment);
router.get("/:postId",comment.getComment);
router.put("/:commentId",middlewareController.verifyTokenAndAuthorization,comment.updateComment);
router.delete("/:commentId",middlewareController.verifyTokenAndAuthorization,comment.deleteComment);

module.exports=router;
