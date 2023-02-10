const Router = require('express')
const projectController = require('../controllers/projectController')
const router = new Router()

router.post('/createProject', projectController.createProject)

module.exports = router

