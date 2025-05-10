const router = require('express').Router();
const userController = require('../controllers/usersController');
const middlewareController = require("../middleware/middlewareController");

router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);  
router.delete('/:id', userController.deleteUser);
router.post("/alluser" ,userController.getAllUsers);

//bug số 3: thiếu dấu "/" trước id :v => bảo sao router không chạy :v
router.post('/follow',middlewareController.verifyTokenAndAuthorization, userController.followUser);
router.post("/unfollow",middlewareController.verifyTokenAndAuthorization, userController.unfollowUser);
router.post("/followers",middlewareController.verifyTokenAndAuthorization, userController.getFollowers);
router.post("/following",middlewareController.verifyTokenAndAuthorization, userController.getFollowing);




module.exports = router;