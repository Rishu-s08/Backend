const rateLimit = require('express-rate-limit')

const createBasicRateLimiter = (maxRequests, time)=>{
    return rateLimit({
        max : maxRequests,
        windowMs : time,
        message : 'Too many requests, please try again laterq',
        standardHeaders : true,
        legacyHeaders : false,
    })
}

module.exports = createBasicRateLimiter;