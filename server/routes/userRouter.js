const Router = require('express')
const userController = require('../controllers/userController')
const auth = require('../middleware/auth')
const router = new Router()

router.post('/reg', userController.reg)
router.post('/log', userController.login)
router.post('/checkLogin', userController.checkLogin)
router.get('/check', auth, userController.check)
router.get('/getAllUsers', userController.getAllUsers)

module.exports = router

