const jwt = require('jsonwebtoken')
const User = require('../models/users_schema')


async function getAuthUser(req, res, next){
    try{
        const token = req.cookies.token || req.body.token || req.headers["x-auth-token"];
        if(!token){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ _id: decoded.id })
        if(!user){
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = user;
        next()
    }catch(e){
        res.status(401).json({ 
            message: e.message,
            status: "error"
         })
    }
}

module.exports = {
    getAuthUser
}