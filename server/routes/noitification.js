const notificationController =require ('../controllers/notificationController');
const middlewareController = require('../middleware/middlewareController');
const router = require('express').Router();

router.get("/",middlewareController.verifyTokenAndtoken,notificationController.getNotification);
router.put("/read",middlewareController.verifyTokenAndtoken,notificationController.markAsRead);
router.put("/",middlewareController.verifyTokenAndtoken,notificationController.delNotification);

module.exports = router;