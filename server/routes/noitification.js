const notificationController =require ('../controllers/notificationController');
const middlewareController = require('../middleware/middlewareController');
const router = require('express').Router();

router.get("/",middlewareController.verifyTokenAndtoken,notificationController.getNotification);

module.exports = router;