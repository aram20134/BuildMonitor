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
            const {formId, layerId, allValues, author, taskId} = req.body
            // console.log(formId, layerId, allValues, author)
            console.log(Array.isArray(allValues))
            if (!formId || !layerId || !allValues) {
                return next(ApiError.badRequest('Получены не все значения'))
            }
            if (!Array.isArray(allValues)) {
                var result = Object.keys(allValues).reduce((acc, cur) => {
                    acc.push({[cur]: allValues[cur]})
                    return acc
                }, []);
                const task = await Task.create({formId, layerId, name: allValues['Название'], author})
                // console.log(task.id)
                result.map((inf) => TaskInfo.create({taskId: task.id, name: Object.keys(inf)[0], value: Object.values(inf)[0]}))
                res.json({status:'200'})
            } else {
                // console.log(allValues.filter((inf) => inf.name === 'Название')[0].value)
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
}

module.exports = new ProjectController()
