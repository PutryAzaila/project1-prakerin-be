const express = require("express")
const app = express()
const PORT = 8000
const cors = require(`cors`)
const bodyParser = require('body-parser')


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname))

const userRoute = require("./routes/userRoute")

app.use("/user", userRoute)

app.listen(PORT, () => {
    console.log(`Server runs on port ${PORT}`)
})
    