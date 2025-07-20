const jwt = require('jsonwebtoken');

const adminMiddleware = (req, res, next)=>{
    const role = req.userInfo.role;
    
    if(role !== 'admin'){
        res.status(403).json({
            success : false,
            message: 'Access denied! Admin rights required'
        })
    }

    next()
}

module.exports = adminMiddleware