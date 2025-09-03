const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');


const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        logger.warn('No token provided');
        return res.status(401).json({ status: false, message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.error('Invalid token', err);
            return res.status(403).json({ status: false, message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}

module.exports = {
    validateToken
}
