const {Comment} = require("../models/models");

class CommentController {
    async create(req, res) {
        const {userId, postId, content, date} = req.body
        const comment = await Comment.create({date, userId, postId, content})
        return res.json(comment)
    }

    async getSorted(req, res) {

    }
}

module.exports = new CommentController()
