require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const models = require('./models/models')
const sequelize = require('./db')
const router = require('./routes/index')
const errorHandle = require('./middleware/ErrorHandle')

const PORT = 5010 || procces.env.PORT
const app = express()

app.use(cors())
app.use(express.json())
app.use('/static', express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload())
app.use('/api', router)
app.use(errorHandle)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({alter: true})
        app.listen(PORT, () => console.log(`SERVER STARTED AT PORT ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()