const amqp = require('amqplib');
const logger = require('./logger')

let connection = null;
let channel = null; 


const EXCHANGE_NAME = 'facebook_events'; // Name of the RabbitMQ exchange

async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(process.env.RABBITMQ_URL)
        channel = await connection.createChannel()

        await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true });
        logger.info("Connected to rabbit mq")
        return channel;
    } catch (error) {
        logger.error('Error connecting to rabbit mq', e)
    }
}

async function publishEvent(routingKey, message) {
    if(!channel){
        await connectRabbitMQ();
    }

    channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(message)))
    logger.info(`Event published to exchange ${EXCHANGE_NAME} with routing key ${routingKey}`, message)
}


module.exports = {
    connectRabbitMQ,
    publishEvent
};
