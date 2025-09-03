require('dotenv').config();
const express = require('express');
const cors = require('cors')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')
const { RedisStore } = require('rate-limit-redis')
const mongoose = require('mongoose');
const mediaRoutes = require('./routes/media_routes');
const errorHandler = require('./middleware/error_handler');
const logger = require('./utils/logger');
const Redis = require('ioredis');
const { connectRabbitMQ, consumeEvent, publishEvent} = require('./utils/rabbitmq');
const handlePostDeleted = require('./eventHandlers/media_event_handler');


const app = express();

const PORT = process.env.PORT || 3003;

mongoose.connect(process.env.MONGO_URI).then(() =>
    logger.info('MongoDB connected')
).catch((error) =>
    logger.error('MongoDB connection error:', error)
);

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
});

const redisClient = new Redis(process.env.REDIS_URL);


const sensitiveEndpointsLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // limit each IP to 5 requests per windowMs
    standardHeaders: true, // send standard rate limit headers
    legacyHeaders: false, // disable legacy rate limit headers
    handler: (req, res) => {
        logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
        res.status(429).send('Too Many Requests');
    },
    store: new RedisStore({         //it is used to store the rate limit data
        sendCommand: (...args) => {  // it sends commands to the Redis client
            return redisClient.call(...args); // call the redis client with the given args
        }
    })
})

app.use('/api/media', sensitiveEndpointsLimiter, mediaRoutes);
app.use(errorHandler);


async function startServer() {
    try {
        await connectRabbitMQ();

        //consume all the events
        await consumeEvent('post.deleted', handlePostDeleted);

        app.listen(PORT, () => {
            logger.info(`Media Service is running on port ${PORT}`);
        })
    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Promise Rejection:', promise, "Reason:", reason);
});