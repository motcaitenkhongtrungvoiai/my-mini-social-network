const router = require('express').Router();
const userController = require('../controllers/usersController');
const middlewareController = require("../controllers/middlewareController");

router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);  
router.delete('/:id', userController.deleteUser);
router.post("/alluser", userController.getAllUsers);

//bug số 3: thiếu dấu "/" trước id :v => bảo sao router không chạy :v
router.post('/follow', userController.followUser);
router.post("/unfollow", userController.unfollowUser);
router.post("/followers", userController.getFollowers);
router.post("/following", userController.getFollowing);




module.exports = router;