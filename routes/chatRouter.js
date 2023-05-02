const Router = require("express")
const router = new Router()
const chatController = require("../controllers/chatController")


router.post("/create", chatController.create)
router.get("/check", chatController.check)
router.get("/", chatController.getAllChats)
router.get("/get-one", chatController.getOne)

module.exports = router
