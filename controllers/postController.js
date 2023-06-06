const {Post, Subscription, User, Like, Comment} = require("../models/models")
const uuid = require("uuid");
const path = require("path");
const ApiError = require("../error/ApiError");

class PostController {
    async create(req, res, next) {
        try {
            const {content, userId} = req.body
            const {image} = req.files || {image: null}

            let post;
            if(image) {
                let fileName = uuid.v4() + ".jpg"
                await image.mv(path.resolve(__dirname, "..", "static", fileName))
                post = await Post.create({image: fileName, content, userId})
            } else {
                post = await Post.create({image, content, userId})
            }
            return res.json(post)
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async update(req, res, next) {
        try {
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
        } catch (e) {
            return next(ApiError.badRequest("Ошибка обновления записи"))
        }
    }

    async delete(req, res, next) {
        try {
            const {postId} = req.body
            await Post.destroy({where: {id: postId}})
            return res.json({})
        } catch (e) {
            return next(ApiError.badRequest("Ошибка удаления записи"))
        }
    }

    async getOne(req, res, next) {
        try {
            const {postId} = req.query
            const post = await Post.findOne({where: {id: postId}})
            return res.json(post)
        } catch (e) {
            return next(ApiError.badRequest("Ошибка получения записи"))
        }
    }

    async getSorted(req, res, next) {
        try {
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
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }

    async getUserPost(req, res, next) {
        try {
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
        } catch (e) {
            return next(ApiError.badRequest(e))
        }
    }
    async search(req, res, next) {
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
            return next(ApiError.badRequest(e))
        }
    }
}

module.exports = new PostController()
