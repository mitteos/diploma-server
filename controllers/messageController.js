const {Message} = require("../models/models");

class MessageController {
    async create(req, res) {
        const {userId, chatId, content} = req.body
        const message = await Message.create({userId, chatId, content})
        return res.json(message)
    }

    async getSorted(req, res) {
        const {chatId} = req.query
        const messages = await Message.findAll({where: {chatId: chatId}})
        return res.json(messages)
    }
}

module.exports = new MessageController()
