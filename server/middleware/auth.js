const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        // console.log(req.headers.authorization)
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(401).json({message:"Не авторизован"})
        }
        // console.log(token)
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (e) {
        console.log('auth:' + e.message)
        return res.status(401).json({message: e.message})
    }
}