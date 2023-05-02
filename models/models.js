const sequelize = require("../db")
const {DataTypes} = require('sequelize')


const User = sequelize.define("user", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING, allowNull: true},
    surname: {type: DataTypes.STRING, allowNull: true},
    image: {type: DataTypes.STRING},
    birthday: {type: DataTypes.DATE, allowNull: true},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Post = sequelize.define("post", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    image: {type: DataTypes.STRING, allowNull: true},
    content: {type: DataTypes.STRING, allowNull: false}
})

const Like = sequelize.define("like", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Comment = sequelize.define("comment", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    content: {type: DataTypes.STRING, allowNull: false},
})

const Chat = sequelize.define("chat", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Message = sequelize.define("message", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    content: {type: DataTypes.STRING, allowNull: false},
})

const Subscription = sequelize.define("subscription", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    subUserId: {type: DataTypes.INTEGER, allowNull: false}
})

const UserChat = sequelize.define("user_chat", {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})


Chat.hasMany(Message)
Message.belongsTo(Chat)

User.hasMany(Message)
Message.belongsTo(User)

User.hasMany(Subscription)
Subscription.belongsTo(User)

User.hasMany(Post)
Post.belongsTo(User)

Post.hasMany(Like)
Like.belongsTo(Post)

User.hasMany(Like)
Like.belongsTo(User)

Post.hasMany(Comment)
Comment.belongsTo(Post)

User.hasMany(Comment)
Comment.belongsTo(User)

User.belongsToMany(Chat, {through: UserChat})
Chat.belongsToMany(User, {through: UserChat})

module.exports = {
    User,
    UserChat,
    Chat,
    Like,
    Comment,
    Post,
    Subscription,
    Message,
}
