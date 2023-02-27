const Router = require('express')
const projectController = require('../controllers/projectController')
const router = new Router()

router.post('/createProject', projectController.createProject)
router.get('/getProjects', projectController.getProjects)
router.post('/addForm', projectController.addForm)
router.post('/addFormInfo', projectController.addFormInfo)
router.post('/addLayer', projectController.addLayer)
router.get('/getLayers', projectController.getLayers)
router.post('/addTask', projectController.addTask)
router.get('/getTasks', projectController.getTasks)
router.get('/getForms', projectController.getForms)
router.get('/getForm', projectController.getForm)
router.post('/changeLayersPos', projectController.changeLayersPos)
router.post('/addListInfo', projectController.addListInfo)

module.exports = router

