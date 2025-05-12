const router = require('express').router;
const middleware= require(`../middleware/middlewareController`);
const comment= require(`../controllers/commentController`);

router.post("/comment",comment.createComment);
router.get("/comment/:postId",comment.getComment);
router.put("/comment/:commentId",comment.updateComment);
router.delete("/comment/:commentId",comment.deleteComment);

module.exports=router;
