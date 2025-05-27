const router = require("express").Router();
const userController = require("../controllers/usersController");
const middlewareController = require("../middleware/middlewareController");
const upload = require("../middleware/uploadImage");

router.get(
  "/profile/:userId", userController.getUser
);
router.delete("/:id", userController.deleteUser);
router.post("/alluser", userController.getAllUsers);

//bug số 3: thiếu dấu "/" trước id :v => bảo sao router không chạy :v
router.post(
  "/follow/:idolId",
  middlewareController.verifyTokenAndtoken,
  userController.toggleFollowUser
);

router.post(
  "/followers",
  middlewareController.verifyTokenAndtoken,
  userController.getFollowers
);
router.post(
  "/following",
  middlewareController.verifyTokenAndtoken,
  userController.getFollowing
);

router.put(
  "/:id",
  middlewareController.verifyTokenAndtoken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverphoto", maxCount: 1 },
  ]),
  userController.updateUser
);

module.exports = router;
