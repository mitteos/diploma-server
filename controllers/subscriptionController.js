const {Subscription, User} = require("../models/models")
const ApiError = require("../error/ApiError");

class SubscriptionController {
    async create(req, res, next) {
        try {
            const {subUserId, userId} = req.body
            const subscription = await Subscription.findOne({where: {userId, subUserId}})
            if(subscription) {
                const deleteSubscription = await Subscription.destroy({where: {id: subscription.id}})
            } else {
                const newSubscription = await Subscription.create({subUserId, userId})
            }
            const mySubscription = await Subscription.findAll({where: {userId: userId}}).then((res) => res.map(el => el.subUserId))
            const users = await User.findAll({where: {id: mySubscription}})
            return res.json(users.filter(el => el.id !== userId))
        } catch (e) {
            return next(ApiError.badRequest("Ошибка создания подписки"))
        }
    }

    async getSorted(req, res, next) {
        try {
            const {userId} = req.query
            const subscriptions = await Subscription.findAll({where: {userId: userId}}).then((res) => res.map(el => el.subUserId))
            const users = await User.findAll({where: {id: subscriptions}})
            return res.json(users.filter(el => el.id !== userId))
        } catch (e) {
            return next(ApiError.badRequest("Ошибка получения подписок"))
        }
    }
}

module.exports = new SubscriptionController()
