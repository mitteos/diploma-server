const Router = require("express")
const router = new Router()
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/authMidleware")

router.post("/registration", userController.registration)
router.post("/login", userController.login)
router.post("/set-image", userController.setImage)
router.get("/auth", authMiddleware, userController.check)
router.get("/search", userController.search)
router.get("/get-profile", userController.getOne)


module.exports = router
