const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const redis = require('ioredis');
const cors = require('helmet')
const helmet = require('helmet')
const errorHandler = require('./middleware/error_handler');
const logger = require('./utils/logger');
const { connectRabbitMQ, consumeEvent}  = require('./utils/rabbitmq');
const { RedisStore } = require('rate-limit-redis');
const { rateLimit } = require('express-rate-limit');
const searchRoutes = require('./routes/search_routes');
const {handlePostCreated, handlePostDeleted}  = require('./eventHandlers/search_event_handler');


const app = express();

const PORT = process.env.PORT || 3004;

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
app.use('/api/search', rateLimiterPost, searchRoutes);

app.use(errorHandler);

async function startServer() {
    try {
        await connectRabbitMQ();
        await consumeEvent('post.created', handlePostCreated)
        await consumeEvent('post.deleted', handlePostDeleted)
        app.listen(PORT, () => {
            logger.info(`Search Service is running on port ${PORT}`);
        })
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();

//unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection:', promise, reason);
});
