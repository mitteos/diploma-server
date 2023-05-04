const uuid = require("uuid")
const path = require("path")
const {User, Subscription, Post} = require("../models/models")
const bcrypt = require("bcrypt")
const ApiError = require("../error/ApiError")
const jwt = require("jsonwebtoken")

const generateJwt = (id, email, name, surname, image, birthday, role) => {
    return jwt.sign(
        {id, email, name, surname, image, birthday, role},
        process.env.SECRET_KEY,
        {expiresIn: "24h"}
    )
}

class UserController {
    async registration(req, res, next) {
        const {email, password, name, surname, birthday, role} = req.body
        if(!email || !password) {
            return next(ApiError.badRequest("Некорректный Email или пароль"))
        }
        const candidate = await User.findOne({where: {email: email}})
        if(candidate) {
            return next(ApiError.badRequest("Пользователь с таким Email уже зарегистрирован"))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, password: hashPassword, name, surname, birthday, role})
        const token = generateJwt(user.id, user.email, user.name, user.surname, user.birthday, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password} = req.body
        const user = await User.findOne({where: {email: email}})
        if(!user) {
            return next(ApiError.badRequest("Пользователь не найден"))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.badRequest("Неверный пароль"))
        }
        const token = generateJwt(user.id, user.email, user.name, user.surname, user.image, user.birthday, user.role)

        const subscriptions = await Subscription.findAll({where: {subUserId: user.id}})
        const posts = await Post.findAll({where: {userId: user.id}})
        const result = {
            token,
            posts,
            subscriptions
        }
        return res.json(result)
    }

    async setImage(req, res) {
        const {email} = req.body
        const {image} = req.files
        let fileName = uuid.v4() + ".jpg"
        await image.mv(path.resolve(__dirname, "..", "static", fileName))
        const user = await User.update({image: fileName}, {where: {email: email}})
        return res.json(user)
    }

    async check(req, res) {
        const token = generateJwt(req.user.id, req.user.email, req.user.name, req.user.surname, req.user.birthday, req.user.role)
    }

    async search(req, res) {
        const {username} = req.query
        const users = await User.findAll()
        const filtered = users.filter(user => `${user.name.toLowerCase()} ${user.surname.toLowerCase()}`.includes(username.toLowerCase()) || `${user.surname.toLowerCase()} ${user.name.toLowerCase()}`.includes(username.toLowerCase()))
        return res.json(filtered)
    }

    async getOne(req, res) {
        const {userId} = req.query
        const user = await User.findOne({where: {id: userId}})
        const subscriptions = await Subscription.findAll({where: {subUserId: userId}})
        const posts = await Post.findAll({where: {userId: userId}})
        const result = {
            ...user.dataValues,
            posts,
            subscriptions
        }
        return res.json(result)
    }
}

module.exports = new UserController()
