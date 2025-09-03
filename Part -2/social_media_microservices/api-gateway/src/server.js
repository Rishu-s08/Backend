require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Redis = require('ioredis')
const helmet = require('helmet');
const {rateLimit} = require('express-rate-limit');
const {RedisStore} = require('rate-limit-redis');
const logger = require("./utils/logger");
const proxy = require('express-http-proxy');
const errorHandler = require('./middleware/error_handler');
const { validateToken } = require("./middleware/auth_middleware");

const app = express();



const redisClient = new Redis(process.env.REDIS_URL);

app.use(cors());
app.use(helmet());
app.use(express.json());


//rate Limiting 
const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers    
    handler : (req, res) =>{
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ status : false, message: 'Too many requests, please try again later.' });
    },
    /*store: new RedisStore(...) This decides where to store the request counts. 
    Instead of keeping it in Node.js memory, we use Redis (via rate-limit-redis).
    sendCommand: (...args) => redisClient.sendCommand(args)
    Hook to tell the Redis store how to talk to your redisClient.
    args is like ["INCR", "key"] or ["EXPIRE", "key", "900"].
    This ensures the limiter works across multiple servers (since Redis is shared). */
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
    })
})

app.use(rateLimiter);

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
})


const proxyOptions = {
    proxyReqPathResolver: (req) =>{
        console.log(`Proxying request to: ${req.originalUrl.replace(/^\/v1/, "/api")}`);
        return req.originalUrl.replace(/^\/v1/, "/api")
    },
    proxyErrorHandler: (err, res, next) =>{
        logger.error(`Proxy error: ${err.message}`);
        res.status(502).json({ status: false, message: 'Bad gateway', error: err.message });
    }
}

//setting up proxy for user-service

app.use('/v1/auth', proxy(process.env.USER_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator : (proxyReqOpts, secReq) =>{
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        return proxyReqOpts;
    },
    userResDecorator : (proxyRes, proxyResData, userReq, userRes) =>{
        logger.info(`Response from user-service: ${proxyRes.statusCode}`);
        return proxyResData;
    }
}));

//setting up proxy for user-service
app.use('/v1/posts', validateToken, proxy(process.env.POST_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator : (proxyReqOpts, secReq) =>{
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.headers['x-user-id'] = secReq.user.userId;
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Response from post-service: ${proxyRes.statusCode}`);
        return proxyResData;
    }
}))


//setting up proxy for media-service
app.use('/v1/media', validateToken, proxy(process.env.MEDIA_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        
        proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
        if(!srcReq.headers['content-type'].startsWith('multipart/form-data')){
            proxyReqOpts.headers['Content-Type'] = 'application/json';
        }
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Response from media-service: ${proxyRes.statusCode}`);
        return proxyResData;
    },
    parseReqBody : false
}))


//setting up proxy for search-service
app.use('/v1/search', validateToken, proxy(process.env.SEARCH_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {

        proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
        logger.info(`Response from search-service: ${proxyRes.statusCode}`);
        return proxyResData;
    },
    parseReqBody: false
}))

app.use(errorHandler)

app.listen(process.env.PORT, () => {
    logger.info(`API Gateway listening on port ${process.env.PORT}`);
    logger.info(`user service URL: ${process.env.USER_SERVICE_URL}`);
    logger.info(`post service URL: ${process.env.POST_SERVICE_URL}`);
    logger.info(`media service URL: ${process.env.MEDIA_SERVICE_URL}`);
    logger.info(`search service URL: ${process.env.SEARCH_SERVICE_URL}`);
});

// api-gateway -> v1/auth/register -> 3000
// user-service -> /api/auth/register -> 3001

// localhost:3000/v1/auth/register -> localhost:3001/api/auth/register