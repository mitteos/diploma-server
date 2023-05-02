require("dotenv").config()
const express = require("express")
const sequelize = require("./db")
const models = require("./models/models")
const cors = require("cors")
const fileUpload = require("express-fileupload")
const router = require("./routes/index")
const errorMiddleware = require("./middleware/ErrorHandlingMiddleware")
const path = require("path")
const WS = require("ws");

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, "static")))
app.use(fileUpload({}))
app.use("/api", router)
app.use(errorMiddleware)

const start = async  () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

const wss = new WS.Server({
    port: 7000,
}, () => console.log("Websocket started on 7000 port"))


wss.on("connection", function connection(ws) {
    ws.on("message", function(message) {
        message = JSON.parse(message)
        console.log(message)
        switch (message.event) {
            case "connect":
                setWsId(ws, message.chatId)
                break;
            case "message":
                broadcastMessage(ws)
                break;
        }
        broadcastMessage(message)
    })
})

function broadcastMessage(message) {
    wss.clients.forEach(client => {
        if(client.id === message.chatId) {
            client.send(JSON.stringify(message))
        }
    })
}

function setWsId(ws, chatId) {
    ws.id = chatId
}


start()
