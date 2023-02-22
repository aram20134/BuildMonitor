const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid')
const path = require('path')
const { User, Project, Form, FormInfo, Layer, Task, TaskInfo } = require('../models/models');
const ApiError = require('../error/ApiError');
const { Sequelize } = require('sequelize');

class ProjectController {
    async createProject(req, res, next) {
        try {
            const project = req.body
            const {image} = req.files

            let fileName = uuid.v4() + '.' + image.name.split('.').pop()
            console.log(image)
            console.log(project)
            const check = Project.create({
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
            image.mv(path.resolve(__dirname, '..', 'static/projectImages', fileName))
            return res.json({check})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getProjects(req, res, next) {
        try {
            const projects = await Project.findAll({include:[{model: Layer, include: [{model: Task, include: [{model: TaskInfo}]}]}]})
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
            const forms = await Form.findAll({include:[{model: FormInfo}], order:[[FormInfo, 'createdAt', 'ASC']]})
            res.json(forms)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getForm(req, res, next) {
        try {
            const {formId} = req.query
            const form = await Form.findOne({where: {id: formId}, include: [{model: FormInfo}], order:[[FormInfo, 'createdAt', 'ASC']]})
            res.json(form)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async addLayer(req, res, next) {
        try {
            const {name, projectId} = req.body
            if (!name || !projectId) {
                return next(ApiError.badRequest('Получены не все значения'))
            }
            const createLayer = await Layer.create({name, projectId})
            const layer = await Layer.findOne({where:{id: createLayer.id}, include: [{model: Task, include: [{model: TaskInfo}]}]})
            res.json(layer)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getLayers(req, res, next) {
        try {
            const {projectId} = req.body
            const layers = await Layer.findAll({where:{projectId}})
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
            console.log(fileName)
            if (!formId || !layerId || !allValues) {
                return next(ApiError.badRequest('Получены не все значения'))
            }
            if (!Array.isArray(allValues)) {
                var result = Object.keys(allValues).reduce((acc, cur) => {
                    acc.push({[cur]: allValues[cur]})
                    return acc
                }, []);
                const task = await Task.create({formId, layerId, name: allValues['Название'], author, image: fileName})
                image.image.mv(path.resolve(__dirname, '..', 'static/taskImages', fileName))
                result.map((inf) => TaskInfo.create({taskId: task.id, name: Object.keys(inf)[0], value: Object.values(inf)[0]}))
                res.json({status:'200'})
            } else {
                const taskName = allValues.filter((inf) => inf.name === 'Название')[0].value
                const task = await Task.update({name: taskName}, {where: {id: taskId}})
                allValues.map((inf) => TaskInfo.update({value: inf.value}, {where: {taskId, name: inf.name}}))
                res.json({status:'201'})
            }
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getTasks(req, res, next) {
        try {
            const {layerId} = req.query
            const tasks = await Task.findAll({where:{layerId}, include: [{model: TaskInfo}], order:[['createdAt', 'DESC']]})
            console.log(layerId)
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
            console.log(layers)
            layers.map((layer) => Layer.update({pos: layer.pos}, {where:{id: layer.id}}))
            res.json({status:'200'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProjectController()
