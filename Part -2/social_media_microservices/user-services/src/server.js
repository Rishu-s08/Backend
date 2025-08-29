const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const logger = require('./utils/logger')
const {RateLimiterRedis} = require('rate-limiter-flexible')
const Redis = require('ioredis')
const {rateLimit} = require('express-rate-limit')
const {RedisStore} = require('rate-limit-redis')
const routes = require('./routes/user-service')
const errorHandler = require('./middlewares/error_handler')

const app = express();

mongoose.connect(process.env.MONGO_URI).then(()=>
    logger.info('MongoDB connected')
).catch((error) =>
    logger.error('MongoDB connection error:', error)
);

const redisClient = new Redis(process.env.REDIS_URL);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next)=>{
    logger.info(`Received ${req.method} request for ${req.url}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
});



//DDOS protection and rate limiting

const rateLimiter = new RateLimiterRedis({
    storeClient : redisClient,
    keyPrefix: 'middleware', // it is used to identify the rate limiter
    points: 100, // 10 requests
    duration: 1, // per second
})


app.use((req, res, next)=>{
    rateLimiter.consume(req.ip).then(() => {
        next();
    }).catch((rej) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).send('Too Many Requests');
    });
});


// ip based rate limiting for sensitive routes
const sensitiveEndpointsLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 500, // limit each IP to 5 requests per windowMs
    standardHeaders: true, // send standard rate limit headers
    legacyHeaders: false, // disable legacy rate limit headers
    handler : (req, res) => {
        logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
        res.status(429).send('Too Many Requests');
    },
    store: new RedisStore({         //it is used to store the rate limit data
        sendCommand: (...args) => {  // it sends commands to the Redis client
            return redisClient.call(...args); // call the redis client with the given args
        }
    })
})

//apply this sensitiveEndpointsLimiter to all auth routes
app.use('/api/auth/register', sensitiveEndpointsLimiter)
app.use('/api/auth', routes)


//Error handler
app.use(errorHandler);


app.listen(process.env.PORT, () => {
    logger.info(`Server running on port ${process.env.PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection:', promise, "Reason:", reason);
});
