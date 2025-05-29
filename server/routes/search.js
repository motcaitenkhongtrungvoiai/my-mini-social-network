const searchController = require("../controllers/findController")
const router = require ("express").Router();

router.get("/users",searchController.fuzzySearchUsers)
router.get("/posts",searchController.fuzzySearchPosts)

module.exports=router;