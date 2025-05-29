const router = require("express").Router();
const postController = require("../controllers/postController");
const middlewareController = require("../middleware/middlewareController");
const upload = require("../middleware/uploadImage");
const dotenv= require("dotenv");
dotenv.config();

router.post("/:id", middlewareController.verifyTokenAndtoken, upload.fields([{ name: "postDoc", maxCount: process.env.MAX_IMAGE_PER_POST }]), postController.createPost); // Create
router.put("/:idPost", middlewareController.verifyTokenAndtoken, postController.updatePost); // update
router.delete("/:idPost", middlewareController.verifyTokenAndtoken, postController.deletePost); // Delete
router.get("/feed", postController.getPosts); //Get all
router.get("/profile/:userId", postController.profilePosts);
router.put("/like/:idPost", middlewareController.verifyTokenAndtoken, postController.likePost);

router.put("/report/:idPost",middlewareController.verifyTokenAndtoken,postController.updateReportPost)// report post for admin only
router.get("/report",middlewareController.verifyTokenAndAdmin,postController.getReportedPosts)
router.delete("/report/:idPost",middlewareController.verifyTokenAndAdmin,postController.delPostforAdmin)
module.exports = router;
