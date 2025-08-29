const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');  
const redis = require('ioredis');
const cors = require('helmet')
const helmet = require('helmet')
const {RedisStore} = require('rate-limit-redis');
const {rateLimit} = require('express-rate-limit');
const logger = require('./utils/logger');
const routes = require('./routes/post_routes');
const errorHandler = require('./middleware/error_handler');


const app = express();
const PORT = process.env.PORT || 3002;


mongoose.connect(process.env.MONGO_URI).then(() => {
    logger.info('MongoDB connected');
}).catch((error) => {
    logger.error('MongoDB connection error:', error);
});

const redisClient = new redis(process.env.REDIS_URL);

// Middleware to parse JSON requests
app.use(express.json());

// Middleware for security headers
app.use(helmet());

// Enable CORS
app.use(cors());

const rateLimiterPost = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    standardHeaders: true, // Enable the `RateLimit-*` headers
    handler: (req, res) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ status: false, message: 'Too many requests, please try again later.' });
    },

    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
    })
})

// routes -> pass redis client to routes
app.use('/api/posts', (req, res, next)=>{
    req.redisClient = redisClient;
    next();
}, rateLimiterPost, routes);


app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});

//unhandled promise rejections
process.on('unhandledRejection', (reason, error) => {
    logger.error('Unhandled Promise Rejection:', error, reason);
});
