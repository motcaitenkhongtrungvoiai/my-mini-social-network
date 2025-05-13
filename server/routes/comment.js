const router = require('express').Router();
const middleware= require(`../middleware/middlewareController`);
const comment= require(`../controllers/commentController`);

router.post("/create",comment.createComment);
router.get("/comme/:postId",comment.getComment);
router.put("/comment/:commentId",comment.updateComment);
router.delete("/comment/:commentId",comment.deleteComment);

module.exports=router;
