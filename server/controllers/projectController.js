const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid')
const path = require('path')
const { User, Project } = require('../models/models');
const ApiError = require('../error/ApiError');

class ProjectController {
    async createProject(req, res, next) {
        try {
            const project = req.body
            const image = req.files
            // const check = Project.create({
            //     // image: 
            //     name: project.projectName,
            //     code: project.projectCode,
            //     dateStart: project.projectDateStart,
            //     dateEnd: project.projectDateEnd,
            //     description: project.projectDescription,
            //     webPage: project.projectWebPage,
            //     street: project.projectStreet,
            //     postalCode: project.projectPostalCode,
            //     country: project.projectCountry,
            //     city: project.projectCity
            // })

            // let fileName = uuid.v4() + '.' + image.name.split('.').pop()
            // image.mv(path.resolve(__dirname, '..', 'static/projectImages', fileName))

            console.log(JSON.stringify(project))
            console.log(image)
            
            return res.json({status: '200'})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ProjectController()
