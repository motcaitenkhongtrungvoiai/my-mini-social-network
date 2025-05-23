const router = require("express").Router();
const postController = require("../controllers/postController");
const middlewareController = require("../middleware/middlewareController");
const upload = require("../middleware/uploadImage");
const dotenv= require("dotenv");
dotenv.config();

router.post("/:id", middlewareController.verifyTokenAndAuthorization, upload.fields([{ name: "postDoc", maxCount: process.env.MAX_IMAGE_PER_POST }]), postController.createPost); // Create
router.put("/:idPost", middlewareController.verifyTokenAndAuthorization, postController.updatePost); // update
router.delete("/:idPost", middlewareController.verifyTokenAndAuthorization, postController.deletePost); // Delete
router.get("/feed", postController.getPosts); //Get all
router.get("/profile/:id", middlewareController.verifyTokenAndAuthorization, postController.profilePosts);
router.put("/like/:idPost", middlewareController.verifyTokenAndAuthorization, postController.likePost);

module.exports = router;
