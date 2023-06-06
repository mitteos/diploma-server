const {Like} = require("../models/models");
const ApiError = require("../error/ApiError");

class LikeController {
    async create(req, res, next) {
        try {
            const {postId, userId} = req.body
            const like = await Like.findOne({where: {userId: userId, postId: postId}})
            if(like) {
                const destroy = await Like.destroy({where: {userId: userId, postId: postId}})
            } else {
                const created = await Like.create({userId: userId, postId: postId})
            }
            return res.json(like)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new LikeController()
