const redis = require('redis');

const client = redis.createClient({
    host: 'localhost',
  port: 6379 // same port used when installation
})

//event listener

client.on('error', (error)=>{
    console.log("error occured", error);   
})

async function testRedisConnection() {
    try {
        await client.connect()
        console.log("connected to redis");
        
        await client.set('some key', "anything")
        const extractValue = await client.get('some key')
        console.log(extractValue);
        
        console.log(await client.keys('*'));
        console.log(await client.del('some key'));
        console.log(await client.keys('*'));
        console.log(await client.get('some key'))
        

        await client.set('count', 0);

        console.log(await client.incrBy('count', 3));
        console.log(await client.incrBy('count', 3));
        console.log(await client.incrBy('count', 3));

        await client.decr('count');
        await client.decr('count');
        await client.decr('count');
        await client.decr('count');
        console.log(await client.get('count'))


    } catch (error) {
        console.error(error)

    } finally{
        await client.quit();
    }
}

testRedisConnection()