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

// const admin = require('firebase-admin');

// const serviceAccount = require('./project-kakasha-firebase-adminsdk-wv2js-b4919b0340.json');
// const schedule = require('node-schedule');

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: 'https://project-kakasha-default-rtdb.firebaseio.com'
// })

// const message = {
//     notification: {
//       title: 'New message',
//       body: 'You have a new message!'
//     }
// };

// schedule.scheduleJob(new Date(2023, 03, 27, 21, 30, 0), () => {
//     console.log('first')
//     admin.messaging().sendToTopic('/topics/project', message, {})
//     .then((res) => console.log('sended', res))
// })

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