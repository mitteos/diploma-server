const Router = require("express")
const router = new Router()
const postController = require("../controllers/postController")
const authMiddleware = require("../middleware/authMidleware")


router.post("/", postController.create)
router.post("/update", postController.update)
router.get("/", postController.getSorted)
router.get("/user", postController.getUserPost)
router.get("/get-one", postController.getOne)

module.exports = router
