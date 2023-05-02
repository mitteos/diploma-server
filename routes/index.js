const Router = require("express")
const router = new Router()
const userRouter = require("./userRouter")
const chatRouter = require("./chatRouter")
const commentRouter = require("./commentRouter")
const likeRouter = require("./likeRouter")
const postRouter = require("./postRouter")
const messageRouter = require("./messageRouter")
const subscriptionRouter = require("./subscriptionRouter")

router.use("/user", userRouter)
router.use("/chat", chatRouter)
router.use("/comment", commentRouter)
router.use("/like", likeRouter)
router.use("/post", postRouter)
router.use("/message", messageRouter)
router.use("/subscription", subscriptionRouter)

module.exports = router
