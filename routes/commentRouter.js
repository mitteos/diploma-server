const Router = require("express")
const router = new Router()
const commentController = require("../controllers/commentController")

router.post("/remove", commentController.remove)
router.post("/", commentController.create)

module.exports = router
