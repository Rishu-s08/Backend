const ioredis = require('ioredis');
// redis client library for Node.js

const redis = new ioredis.Redis();

async function testRedis() {
    await redis.set('key', 'value');
    const result = await redis.get('key');
    console.log(result);
    redis.quit();
}
testRedis();