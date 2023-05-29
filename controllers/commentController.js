const {Comment} = require("../models/models");

class CommentController {
    async create(req, res) {
        const {userId, postId, content} = req.body
        const comment = await Comment.create({userId, postId, content})
        return res.json(comment)
    }

    async remove(req, res) {
        const {commentId} = req.body
        await Comment.destroy({where: {id: commentId}})
        return res.json({})
    }
}

module.exports = new CommentController()
