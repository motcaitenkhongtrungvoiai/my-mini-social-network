const router = require('express').Router();
const userController = require('../controllers/usersController');

router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);  
router.delete('/:id', userController.deleteUser);
router.post("/alluser", userController.getAllUsers);
router.put(":id/follow", userController.followUser);
router.put(":id/unfollow", userController.unfollowUser);
router.post("/followers", userController.getFollowers);
router.post("/following", userController.getFollowing);




module.exports = router;