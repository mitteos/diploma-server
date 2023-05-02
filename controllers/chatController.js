const {Chat, UserChat, Message, User} = require("../models/models")
const {Op} = require("sequelize");

class ChatController {
    async create(req, res) {
        const {userId, sendUserId} = req.body
        const chat = await Chat.create()
        const userChat = await UserChat.bulkCreate([{userId: userId, chatId: chat.id}, {userId: sendUserId, chatId: chat.id}])
        return res.json(chat.id)
    }

    async check(req, res) {
        const {userId, sendUserId} = req.query
        const userChats = await UserChat.findAll({where: {userId: userId}}).then(res => res.map(el => el.chatId))
        const sendUserChats = await UserChat.findAll({where: {userId: sendUserId}}).then(res => res.map(el => el.chatId))
        const isExist = userChats.filter(el => sendUserChats.includes(el))
        return res.json({chatId: isExist[0] || null})
    }

    async getAllChats(req, res) {
        const {userId} = req.query
        const chats = await UserChat.findAll({where: {userId: userId}})
        const chatIds = chats.map(el => el.chatId)
        const allChats = await UserChat.findAll({where: {chatId: chatIds}}).then(res => res.filter(el => el.userId !== +userId))
        const friendIds = allChats.map(el => el.userId)
        const friends = await User.findAll({where: {id: friendIds}})

        const result = allChats.map(el => {
            const userInfo = friends.find(friend => friend.id === el.userId)
            return {
                chatId: el.chatId,
                user: {
                    name: userInfo.name,
                    surname: userInfo.surname,
                    image: userInfo.image
                }
            }
        })

        // const result = friends.map(el => {
        //         return {
        //             name: el.name,
        //             surname: el.surname,
        //             image: el.image,
        //             lastMessage: {}
        //         }
        //     })
        return res.json(result)
    }

    async getOne(req, res) {
        const {id} = req.query
        const messages = await Message.findAll({where: {chatId: id}})

        return res.json({count: messages.length, items: messages})
    }
}

module.exports = new ChatController()
