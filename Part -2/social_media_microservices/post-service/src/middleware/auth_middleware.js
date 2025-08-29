const logger = require('../utils/logger');

const authenticateRequest = (req, res, next) => {
    const userId = req.headers['X-user-id'];

    if(!userId){
        logger.warn('Access attempted without user ID');
        return res.status(401).json({success: false, error: 'Unauthorized, Please login to continue' });
    }

    req.user = {userId};
    next();
}

module.exports = {
    authenticateRequest
};
