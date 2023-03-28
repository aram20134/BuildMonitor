const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid')
const path = require('path')
const { User, Project, Form, FormInfo, Layer, Task, TaskInfo, ListInfo, Access } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Sequelize } = require('sequelize');

class ProjectController {
    async createProject(req, res, next) {
        try {
            const project = req.body
            let fileName = null
            if (req.files) {
                const {image} = req.files
                fileName = uuid.v4() + '.' + image.name.split('.').pop()
                image.mv(path.resolve(__dirname, '..', 'static/projectImages', fileName))
            }
            const check = await Project.create({
                image: fileName,
                name: project.projectName,
                code: project.projectCode,
                dateStart: project.projectDateStart === "''" ? null : project.projectDateStart,
                dateEnd: project.projectDateEnd === "''" ? null : project.projectDateEnd,
                description: project.projectDescription,
                webPage: project.projectWebPage,
                street: project.projectStreet,
                postalCode: project.projectPostalCode,
                country: project.projectCountry,
                city: project.projectCity
            })
            console.log(req.user)
            Access.create({userId: req.user.id, projectId: check.id, role: 'Администратор'})
            return res.json({status:200})
        } catch (e) {
            console.log(e.message)
            return next(ApiError.badRequest(e.message))
        }
    }
    async getProjects(req, res, next) {
        try {
            var projects = []
            const accesses = await Access.findAll({where:{userId: req.user.id}})
            for (let i = 0; i < accesses.length; i++) {
                const el = accesses[i];
                var prj = await Project.findOne({where:{id: el.projectId}, include:[{model: Layer, include: [{model: Task, include: [{model: TaskInfo}]}]}]})
                projects.push(prj)
            }
            // const projects = await Project.findAll({include:[{model: Layer, include: [{model: Task, include: [{model: TaskInfo}]}]}]})
            res.json(projects)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async addForm(req, res, next) {
        try {
            const {name} = req.body
            const type = await Form.create({name})
            res.json({status:'200'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async addFormInfo(req, res, next) {
        try {
            const {name, type, formId} = req.body
            const formInfo = await FormInfo.create({name, type, formId})
            res.json({status:'200'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getForms(req, res, next) {
        try {
            const forms = await Form.findAll({include:[{model: FormInfo, include: [{model: ListInfo}]}], order:[[FormInfo, 'createdAt', 'ASC']]})
            res.json(forms)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getForm(req, res, next) {
        try {
            const {formId} = req.query
            const form = await Form.findOne({where: {id: formId}, include: [{model: FormInfo, include: [{model: ListInfo}]}], order:[[FormInfo, 'createdAt', 'ASC']]})
            res.json(form)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async addLayer(req, res, next) {
        try {
            const {name, projectId} = req.body
            var fileName = null
            if (!name || !projectId) {
                next(ApiError.badRequest('Получены не все значения'))
            }
            if (req.files) {
                var {image} = req.files
            }
            if (image) {
                fileName = uuid.v4() + '.' + image.name.split('.').pop()
                image.mv(path.resolve(__dirname, '..', 'static/layerImages', fileName))
            }
            const create = await Layer.create({name, projectId, plan: fileName})
            const layer = await Layer.findOne({where:{id: create.id}, include: [{model: Task, include: [{model: TaskInfo}]}]})
            res.json(layer)
            // res.json({stats:'da'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getLayers(req, res, next) {
        try {
            const {projectId} = req.query
            const layers = await Layer.findAll({where:{projectId}, include: [{model: Task, include: [{model: TaskInfo}]}]})
            res.json(layers)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async addTask (req, res, next) {
        try {
            const createTask = req.body
            const image = req.files
            const allValues = JSON.parse(createTask.allValues)
            const formId = createTask.formId
            const layerId = createTask.layerId
            const author = createTask.author
            const taskId = createTask?.taskId
            let fileName = null

            if (image) {
                fileName = uuid.v4() + '.' + image.image.name.split('.').pop()
            }
            if (!formId || !layerId || !allValues) {
                return next(ApiError.badRequest('Получены не все значения'))
            }
            if (!Array.isArray(allValues)) {
                var result = Object.keys(allValues).reduce((acc, cur) => {
                    acc.push({[cur]: allValues[cur]})
                    return acc
                }, []);
                if (fileName) {
                    image.image.mv(path.resolve(__dirname, '..', 'static/taskImages', fileName))
                    console.log('Image moved!')
                }
                const task = await Task.create({formId, layerId, name: allValues['Название'], author, image: fileName})
                console.log('Task created!')
                result.map((inf) => TaskInfo.create({taskId: task.id, name: Object.keys(inf)[0], value: Object.values(inf)[0]}))
                console.log('TaskInfos created!')
                const allTask = await Task.findOne({where: {name: allValues['Название']}, include: [{model: TaskInfo}]})
                res.json(allTask)
            } else {
                const taskName = allValues.filter((inf) => inf.name === 'Название')[0].value
                const task = await Task.update({name: taskName}, {where: {id: taskId}})
                // allValues.map((inf) => TaskInfo.update({value: inf.value}, {where: {taskId, name: inf.name}}))
                for (let i = 0; i < allValues.length; i++) {
                    const inf = allValues[i];
                    await TaskInfo.update({value: inf.value}, {where: {taskId, name: inf.name}})
                }
                const result = await Task.findOne({where: {name: taskName}, include: [{model: TaskInfo}]})
                res.json(result)
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getTasks(req, res, next) {
        try {
            const {layerId} = req.query
            const tasks = await Task.findAll({where:{layerId}, include: [{model: TaskInfo}], order:[['createdAt', 'DESC']]})
            res.json(tasks)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async addTaskInfo(req, res, next) {
        try {
            const {taskId, data} = req.body
            // const taskInfo = await TaskInfo.create({taskId, name, value, type})
            // res.json({status: '200'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async changeLayersPos(req, res, next) {
        try {
            const layers = req.body
            layers.map((layer) => Layer.update({pos: layer.pos}, {where:{id: layer.id}}))
            res.json({status:'200'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async addListInfo(req, res, next) {
        try {
            const {name, formInfoId} = req.body
            const ico = req.files?.ico
            if (!name || !formInfoId) {
                return next(ApiError.badRequest('Все значения нужны'))
            }
            var fileName = null
            if (ico) {
                fileName = uuid.v4() + '.' + ico.name.split('.').pop()
                ico.mv(path.resolve(__dirname, '..', 'static/icoList', fileName))
            }
            await ListInfo.create({name, formInfoId, ico:fileName})
            res.json({status: '200'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getProjectUsers(req, res, next) {
        try {
            const { projectId } = req.query
            const allUsers = await Access.findAll({where: {projectId}})
            var users = []
            for (let i = 0; i < allUsers.length; i++) {
                const el = allUsers[i];
                const user = await User.findOne({where:{id: el.userId}})
                users.push({...user.dataValues, role: el.role})
            }
            res.json(users)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async addUserToProject (req, res, next) {
        try {
            const {userId, projectId} = req.body
            await Access.create({userId, projectId, role: 'Сотрудник'})

            res.json(true)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async removeUserFromProject (req, res, next) {
        try {
            const {userId, projectId} = req.body
            await Access.destroy({where: {projectId, userId}})
            res.json(true)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getProjectUser (req, res, next) {
        try {
            const {projectId} = req.query
            console.log(projectId)
            const user = await User.findOne({where: {id: req.user.id}})
            const acc = await Access.findOne({where: {projectId, userId: req.user.id}})
            res.json({...user.dataValues, role: acc.role})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async delTask (req, res, next) {
        try {
            const {taskId} = req.body
            console.log(taskId)
            await Task.destroy({where:{id: taskId}})
            res.json(true)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProjectController()
