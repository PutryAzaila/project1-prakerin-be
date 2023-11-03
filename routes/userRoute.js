const express = require(`express`)
const app = express()
app.use(express.json())
const user = require(`../controller/user`)
const auth = require('../auth/auth')

app.post("/login", user.login)
app.get("/getAllUser",auth.authVerify, user.getAllUser)
app.post("/addUser", user.addUser)
app.post("/findUser",auth.authVerify, user.findUser)

module.exports = app