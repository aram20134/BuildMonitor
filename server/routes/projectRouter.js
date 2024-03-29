const Router = require('express')
const projectController = require('../controllers/projectController')
const auth = require('../middleware/auth')
const router = new Router()

router.post('/createProject', auth, projectController.createProject)
router.get('/getProjects', auth, projectController.getProjects)
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
router.get('/getProjectUsers', projectController.getProjectUsers)
router.post('/addUserToProject', projectController.addUserToProject)
router.post('/removeUserFromProject', projectController.removeUserFromProject)
router.get('/getProjectUser', auth, projectController.getProjectUser)
router.post('/delTask', auth, projectController.delTask)

module.exports = router

