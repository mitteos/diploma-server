const {Subscription, User} = require("../models/models")

class SubscriptionController {
    async create(req, res) {
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
    }

    async getSorted(req, res) {
        const {userId} = req.query
        const subscriptions = await Subscription.findAll({where: {userId: userId}}).then((res) => res.map(el => el.subUserId))
        const users = await User.findAll({where: {id: subscriptions}})
        return res.json(users.filter(el => el.id !== userId))
    }
}

module.exports = new SubscriptionController()
