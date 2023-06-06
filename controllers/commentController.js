const {Comment} = require("../models/models");
const ApiError = require("../error/ApiError");

class CommentController {
    async create(req, res, next) {
        try {
            const {userId, postId, content} = req.body
            const comment = await Comment.create({userId, postId, content})
            return res.json(comment)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }

    }

    async remove(req, res, next) {
        try {
            const {commentId} = req.body
            await Comment.destroy({where: {id: commentId}})
            return res.json({})
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new CommentController()
