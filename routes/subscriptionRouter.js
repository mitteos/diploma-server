const Router = require("express")
const router = new Router()
const subscriptionController = require("../controllers/subscriptionController")
const authMiddleware = require("../middleware/authMidleware")


router.post("/", subscriptionController.create)
router.get("/", subscriptionController.getSorted)

module.exports = router
