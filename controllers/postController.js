const {Post, Subscription, User, Like, Comment} = require("../models/models")
const uuid = require("uuid");
const path = require("path");

class PostController {
    async create(req, res) {
        const {content, userId} = req.body
        const {image} = req.files || {image: null}

        let post;
        if(image) {
            let fileName = uuid.v4() + ".jpg"
            await image.mv(path.resolve(__dirname, "..", "static", fileName))
            post = await Post.create({image: fileName, content, date, userId})
        } else {
            post = await Post.create({image, content, date, userId})
        }
        return res.json(post)
    }

    async update(req, res) {
        const {postId, content} = req.body
        const {image} = req.files || {image: null}
        const post = await Post.findOne({where: {id: postId}})
        if(image) {
            let fileName = uuid.v4() + ".jpg"
            await image.mv(path.resolve(__dirname, "..", "static", fileName))
            post.image = fileName
        }
        post.content = content
        await post.save()
        return res.json(post)
    }

    async delete(req, res) {
        const {postId} = req.body
        await Post.destroy({where: {id: postId}})
        return res.json({})
    }

    async getOne(req, res) {
        const {postId} = req.query
        const post = await Post.findOne({where: {id: postId}})
        return res.json(post)
    }

    async getSorted(req, res) {
        const {userId} = req.query
        const subscriptions = await Subscription.findAll({where: {userId: userId}})
        const subscriptionsIds = subscriptions.map(el => el.subUserId)
        subscriptionsIds.push(userId)
        const posts = await Post.findAll(
            {
                where: {userId: subscriptionsIds},
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "surname", "image"]
                    },
                    {
                        model: Like,
                        as: "likes"
                    },
                    {
                        model: Comment,
                        as: "comments",
                        include: [
                            {model: User, attributes: ["id", "name", "surname", "image"]}
                        ]
                    }
                ],
                order: [["createdAt", "DESC"]]
            })
        return res.json(posts)
    }

    async getUserPost(req, res) {
        const {userId} = req.query
        const posts = await Post.findAll(
            {
                where: {userId: userId},
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "surname", "image"]
                    },
                    {
                        model: Like,
                        as: "likes"
                    },
                    {
                        model: Comment,
                        as: "comments",
                        include: [
                            {model: User, attributes: ["id", "name", "surname", "image"]}
                        ]
                    }
                ],
                order: [["createdAt", "DESC"]]
            }
        )
        return res.json(posts)
    }
    async search(req, res) {
        try {
            const {content} = req.query
            const posts = await Post.findAll({
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: ["id", "name", "surname", "image"]
                    },
                    {
                        model: Like,
                        as: "likes"
                    },
                    {
                        model: Comment,
                        as: "comments",
                        include: [
                            {model: User, attributes: ["id", "name", "surname", "image"]}
                        ]
                    }
                ],
                order: [["createdAt", "DESC"]]})
            const result = posts.filter(post => post.content.toLowerCase().includes(content.toLowerCase()))
            return res.json(result)
        } catch (e) {
            return res.json(e)
        }
    }
}

module.exports = new PostController()
