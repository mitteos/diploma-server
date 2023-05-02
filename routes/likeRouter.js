const Router = require("express")
const router = new Router()
const likeController = require("../controllers/likeController")


router.post("/", likeController.create)
router.get("/", likeController.getSorted)

module.exports = router
