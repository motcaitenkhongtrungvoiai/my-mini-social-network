const router = require("express").Router();
const userController = require("../controllers/usersController");
const middlewareController = require("../middleware/middlewareController");
const upload = require("../middleware/uploadImage");

router.get(
  "/profile/:userId", userController.getUser
);
router.delete("/:id", middlewareController.verifyTokenAndAdmin,userController.deleteUser);
router.post("/alluser",middlewareController.verifyTokenAndAdmin, userController.getAllUsers);
router.put("/promote/:promoteId",middlewareController.verifyTokenAndAdmin,userController.changeUserRole)
//bug số 3: thiếu dấu "/" trước id :v => bảo sao router không chạy :v
router.post(
  "/follow/:idolId",
  middlewareController.verifyTokenAndtoken,
  userController.toggleFollowUser
);

router.get(
  "/followers/",
  middlewareController.verifyTokenAndtoken,
  userController.getFollowers
);
router.get(
  "/following/",
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
