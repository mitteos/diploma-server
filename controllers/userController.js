const uuid = require("uuid");
const path = require("path");
const { User, Subscription, Post, Like} = require("../models/models");
const bcrypt = require("bcrypt");
const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");

const generateJwt = (id, email, name, surname, image, birthday, role) => {
    return jwt.sign(
        { id, email, name, surname, image, birthday, role },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
    );
};

class UserController {
    async registration(req, res, next) {
        const { email, password, name, surname, birthday, role } = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest("Некорректный Email или пароль"));
        }
        const candidate = await User.findOne({ where: { email: email } });
        if (candidate) {
            return next(
                ApiError.badRequest(
                    "Пользователь с таким Email уже зарегистрирован"
                )
            );
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({
            email,
            password: hashPassword,
            name,
            surname,
            birthday,
            role,
        });
        const token = generateJwt(
            user.id,
            user.email,
            user.name,
            user.surname,
            user.birthday,
            user.role
        );
        return res.json({ token });
    }

    async login(req, res, next) {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return next(ApiError.badRequest("Пользователь не найден"));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.badRequest("Неверный пароль"));
        }
        const token = generateJwt(
            user.id,
            user.email,
            user.name,
            user.surname,
            user.image,
            user.birthday,
            user.role
        );

        const subscriptions = await Subscription.findAll({
            where: { subUserId: user.id },
        });
        const posts = await Post.findAll({ where: { userId: user.id } });
        const result = {
            token,
            posts,
            subscriptions,
        };
        return res.json(result);
    }

    async edit(req, res, next) {
        try {
            const { userId, name, surname, birthday } = req.body;
            const { image } = req.files || { image: null };

            const user = await User.findOne({ where: { id: userId } });

            if (image) {
                let fileName = uuid.v4() + ".jpg";
                await image.mv(path.resolve(__dirname, "..", "static", fileName));
                user.image = fileName;
            }
            user.name = name;
            user.surname = surname;
            user.birthday = birthday;
            await user.save();

            const token = await jwt.sign(
                {
                    name: user.name,
                    surname: user.surname,
                    image: user.image,
                    birthday: user.birthday,
                },
                process.env.SECRET_KEY,
                { expiresIn: "24h" }
            );
            return res.json(token);
        } catch (e) {
            return next(ApiError.badRequest("Ошибка редактирования профиля"))
        }
    }

    async check(req, res) {
        const token = generateJwt(
            req.user.id,
            req.user.email,
            req.user.name,
            req.user.surname,
            req.user.birthday,
            req.user.role
        );
    }

    async search(req, res, next) {
        try {
            const { username } = req.query;
            const users = await User.findAll();
            const filtered = users.filter(
                (user) =>
                    `${user.name.toLowerCase()} ${user.surname.toLowerCase()}`.includes(
                        username.toLowerCase()
                    ) ||
                    `${user.surname.toLowerCase()} ${user.name.toLowerCase()}`.includes(
                        username.toLowerCase()
                    )
            );
            return res.json(filtered);
        } catch (e) {
            return next(ApiError.badRequest("Ошибка посика пользователей"))
        }
    }

    async getOne(req, res, next) {
        try {
            const { userId } = req.query;
            const user = await User.findOne({ where: { id: userId } });
            const subscriptions = await Subscription.findAll({
                where: { subUserId: userId },
            });
            const posts = await Post.findAll({ where: { userId: userId } });
            const result = {
                ...user.dataValues,
                posts,
                subscriptions,
            };
            return res.json(result);
        } catch (e) {
            return next(ApiError.badRequest("Ошибка поулчения информации о пользователе"))
        }
    }

    async getPopular(req, res, next) {
        try {
            const users = await User.findAll({include: [{model: Like, as: "likes"}]})
            const result = users.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    image: user.image,
                    likes: user.likes
                }
            }).sort((a, b) => b.likes.length - a.likes.length)
            return res.json(result.length > 10 ? result.slice(0, 10) : result)
        } catch (e) {
            return next(ApiError.badRequest("Ошибка получения списка популярных пользователей"))
        }
    }

    async setRole(req, res, next) {
        try {
            const {adminId, userId, role} = req.body
            const admin = await User.findOne({where: {id: adminId}})
            if(admin.role !== "ADMIN") {
                return next(ApiError.badRequest("Доступ для администратора"))
            }
            const user = await User.findOne({where: {id: userId}})
            user.role = role
            await user.save()
            return res.json({userId :user.id, role: user.role})
        } catch (e) {
            return next(ApiError.badRequest("Ошибка изменения роли"))
        }
    }
}

module.exports = new UserController();
