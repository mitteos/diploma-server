const {Chat, UserChat, Message, User} = require("../models/models")
const ApiError = require("../error/ApiError");

class ChatController {
    async create(req, res, next) {
        try {
            const {userId, sendUserId} = req.body
            const chat = await Chat.create()
            const userChat = await UserChat.bulkCreate([{userId: userId, chatId: chat.id}, {userId: sendUserId, chatId: chat.id}])
            return res.json(chat.id)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }

    }

    async check(req, res, next) {
        try {
            const {userId, sendUserId} = req.query
            const userChats = await UserChat.findAll({where: {userId: userId}}).then(res => res.map(el => el.chatId))
            const sendUserChats = await UserChat.findAll({where: {userId: sendUserId}}).then(res => res.map(el => el.chatId))
            const isExist = userChats.filter(el => sendUserChats.includes(el))
            return res.json({chatId: isExist[0] || null})
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getAllChats(req, res, next) {
        // try {
            const {userId} = req.query
            const chats = await UserChat.findAll({where: {userId: userId}})
            const chatIds = chats.map(el => el.chatId)
            const allChats = await UserChat.findAll({where: {chatId: chatIds}}).then(res => res.filter(el => el.userId !== +userId))
            const friendIds = allChats.map(el => el.userId)
            const friends = await User.findAll({where: {id: friendIds}})
            const messages = await Message.findAll({where: {chatId: allChats.map(el => el.chatId)}})

            const result = allChats.map(el => {
                const userInfo = friends.find(friend => friend.id === el.userId)
                const message = messages.filter(mess => mess.chatId === el.chatId).sort((a, b) => b.createdAt - a.createdAt)
                return {
                    chatId: el.chatId,
                    user: {
                        name: userInfo.name,
                        surname: userInfo.surname,
                        image: userInfo.image
                    },
                    lastMessage: message.length ? message[0] : null
                }
            })
            return res.json(result)
        // } catch (e) {
        //     return next(ApiError.badRequest(e))
        // }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.query
            const messages = await Message.findAll({where: {chatId: id}})

            return res.json({count: messages.length, items: messages})
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new ChatController()
