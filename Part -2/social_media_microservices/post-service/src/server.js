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
const {connectRabbitMQ} = require('./utils/rabbitmq');


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
    max: 100, // Limit each IP to 10 requests per windowMs
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

async function startServer() {
    try {
        await connectRabbitMQ();
        app.listen(PORT, ()=>{
            logger.info(`Post Service is running on port ${PORT}`);
        })
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();

//unhandled promise rejections
process.on('unhandledRejection', (reason, error) => {
    logger.error('Unhandled Promise Rejection:', error, reason);
});
