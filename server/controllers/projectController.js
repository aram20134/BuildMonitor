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
            const projects = await Project.findAll({include:[{model: Layer, include: [{model: Task}]}]})
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
            const forms = await Form.findAll({include:[{model: FormInfo}]})
            res.json(forms)
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async addLayer(req, res, next) {
        try {
            const {name, projectId} = req.body
            const layer = await Layer.create({name, projectId})
            res.json({status:'200'})
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
            const {formId, layerId, data} = req.body
            const task = await Task.create({formId, layerId})
            data.map((info) => TaskInfo.create({taskId: task.id, name: info.name, value: info.value, type: info.type}))
            res.json({status:'200'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async getTasks(req, res, next) {
        try {
            const {layerId} = req.body
            const tasks = await Task.findAll({where:{layerId}, include: [{model: TaskInfo}]})
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
}

module.exports = new ProjectController()
