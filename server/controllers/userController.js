const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const uuid = require('uuid')
const path = require('path')
const { User } = require('../models/models');
const ApiError = require('../error/ApiError');


const signJWT = ({id, name}) => {
    return jwt.sign(
        {id, name}, 
        process.env.SECRET_KEY,
        {expiresIn: '1024h'}
    )
}

class UserController {
    async reg (req, res, next) {
        try {
            const {name, password} = req.body
            if (!name || !password) {
                return next(ApiError.badRequest('Получение не все значения'))
            }
            const checkName = await User.findOne({where:{name}})
            if (checkName) {
                return next(ApiError.badRequest('Пользователь с таким именем или почтой уже существует'))
            }
            const hashPassword = await bcrypt.hash(password, 3)
            const user = await User.create({password:hashPassword, name})
            // const token = signJWT(user)
            return res.json({user: true})
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }
    async checkLogin (req, res, next) {
        const {name} = req.body
        if (!name) {
            return next(ApiError.badRequest('Получены не все значения'))
        }
        const user = await User.findOne({where:{name}})
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        return res.json({user: true})
    }
    async login (req, res, next) {
        const {name, password} = req.body
        const user = await User.findOne({where:{name}})
        if (!user) {
            return next(ApiError.badRequest('Пользователь не найден'))
        }
        let comparePasswd = bcrypt.compareSync(password, user.password)
        if (!comparePasswd) {
            return next(ApiError.badRequest('Неверный пароль'))
        }
        const token = signJWT(user)

        return res.json({token})
    }
}   
module.exports = new UserController()
