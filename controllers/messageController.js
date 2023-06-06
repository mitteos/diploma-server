const {Message} = require("../models/models");
const ApiError = require("../error/ApiError");

class MessageController {
    async create(req, res, next) {
        try {
            const {userId, chatId, content} = req.body
            const message = await Message.create({userId, chatId, content})
            return res.json(message)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getSorted(req, res, next) {
        try {
            const {chatId} = req.query
            const messages = await Message.findAll({where: {chatId: chatId}})
            return res.json(messages)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new MessageController()
