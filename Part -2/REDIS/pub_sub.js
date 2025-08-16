// -> publisher ->n send -> channel -> subscriber will consume

/*
The key difference

    Pipeline

        Purpose: Send multiple commands in one go to reduce round-trip time (RTT) to the server.

        Commands are not atomic — other clients can run commands in between.

        Example in Node Redis:

    const pipeline = client.multi();
    pipeline.set('foo', 'bar');
    pipeline.get('foo');
    pipeline.exec((err, results) => {
      console.log(results);
    });

    Here, if you don’t use WATCH or other transaction logic, this is just a pipeline.

Transaction

    Purpose: Execute a group of commands atomically — either all succeed or none.

    Requires WATCH to check keys and MULTI/EXEC to commit changes.

    Example:

await client.watch('balance');
const pipeline = client.multi();
pipeline.decrby('balance', 50);
pipeline.incrby('savings', 50);
const results = await pipeline.exec(); // only executes if key wasn't changed

This ensures no one changes the key mid-operation.
*/

const redis = require('redis')

const client = redis.createClient({
    host: 'localhost',
    port: 6379
})

client.on('error', (error)=>{
    console.log("error occured", error);

})

async function testAdditionalFeatures(){
    try {
        await client.connect();

        // const subscriber = client.duplicate() // create a new client that shares a same connection
        // await subscriber.connect() // connect a redis server for subscriber
        // await subscriber.subscribe('dummy-channel', (message, channel)=>{
        //     console.log(`Received message from ${channel} : ${message}`);
            
        // })

        // //publish message to the dummy channel 
        // await client.publish('dummy-channel', 'some message data from publisher')
        // await client.publish('dummy-channel', 'some newwwwwwwwww message data from publisher')

        // // wait some time before quit the connection
        // await new Promise((resolve)=>setTimeout(resolve, 2000))

        // await subscriber.unsubscribe('dummy-channel')
        // await subscriber.quit()


        //pipeling & transactions
            // const multi = client.multi();

            // multi.set('Key-transaction',  'value1');
            // multi.set('Key-transaction2',  'value2');
            // multi.get('Key-transaction');
            // multi.get('Key-transaction2');

            // const result = await multi.exec()
            // console.log(result);
            

            // const pipeline = client.multi();
            // pipeline.set('Key-pipeline', 'value1');
            // pipeline.set('Key-pipeline2', 'value2');
            // pipeline.get('Key-pipeline');
            // pipeline.get('Key-pipeline2');
            // const pipelineresults = await pipeline.exec()
            // console.log(pipelineresults);
            

            // //batch data operations
            // const pipelineOne = client.multi();
            
            // for(let i=0;i<1200; i++){
            //     pipeline.set(`user:${i}:action`, `Action ${i}`)
            // }
            // await pipelineOne.exec();

            // const dummyExample  =client.multi();
            // multi.decrBy('accout:123:balance', 100);
            // multi.incrBy('accout:000:balance', 100);

            // const finalResult = await dummyExample.exec();
            // console.log(finalResult);


            console.log("performance test")
            console.time("without pipeline")

            for(let i=0;i<1000;i++){
                await client.set(`user:${i}:action`, `Action ${i}`)
            }

            console.timeEnd("without pipeline")
            console.time("with pipeline")

            const pipeline = client.multi();
            for(let i=0;i<1000;i++){
                pipeline.set(`user:${i}:action`, `Action ${i}`)
            }
            await pipeline.exec();

            console.timeEnd("with pipeline")


    } catch (error) {
        console.log("error occured", error);

    } finally{
        await client.quit();
    
    }
}
testAdditionalFeatures()