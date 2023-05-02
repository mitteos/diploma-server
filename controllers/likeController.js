const {Like} = require("../models/models");

class LikeController {
    async create(req, res) {
        const {postId, userId} = req.body
        const like = await Like.findOne({where: {userId: userId, postId: postId}})
        if(like) {
            const destroy = await Like.destroy({where: {userId: userId, postId: postId}})
        } else {
            const created = await Like.create({userId: userId, postId: postId})
        }
        return res.json(like)
    }

    async getSorted(req, res) {

    }
}

module.exports = new LikeController()
