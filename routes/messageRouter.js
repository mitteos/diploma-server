const Router = require("express")
const router = new Router()
const messageController = require("../controllers/messageController")


router.post("/", messageController.create)
router.get("/", messageController.getSorted)

module.exports = router
