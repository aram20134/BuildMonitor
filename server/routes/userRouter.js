const Router = require('express')
const userController = require('../controllers/userController')
const router = new Router()

router.post('/reg', userController.reg)
router.post('/log', userController.login)
router.post('/checkLogin', userController.checkLogin)

module.exports = router

