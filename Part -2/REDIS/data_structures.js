const redis = require('redis')

const client = redis.createClient({
    host: 'localhost',
    port: 6379
})

client.on('error', (error)=>{
    console.log("error occured", error);
})

async function redisDataStructures() {
    try {
        await client.connect()
        // string -> SET,GET,MSET,MGET (M->multiple)

        await client.set("user:name", "Some Name")
        const name = await client.get("user:name")
        // console.log(name);

        await client.mSet(["user:email", "someenmail.comn", "user:age", "23", "user:gender", "male"])
        const [email, age, gender] = await client.mGet(["user:email", "user:age", "user:gender"])
        // console.log(email, age, gender);

        // lists -> LPUSH, RPUSH, LPOP, RPOP, LRANGE

        // await client.lPush('notes', ['note1', 'note2', 'note3'])
        // const notes = await client.lRange('notes', 0, -1)
        // console.log(notes);

        // const firstNote = await client.lPop('notes')
        // console.log(firstNote);

        // const lastNote = await client.rPop('notes')
        // console.log(lastNote);

        // const remainingNote = await client.lRange('notes', 0, -1)
        // console.log(remainingNote);




        //sets - SADD (add), SMEMBERS (return member),  SISMEMBER (is present), SREM (remove)
        // await client.sAdd('user:nickName', ['nick1', 'nick2', 'nick3'])
        // const nickNames = await client.sMembers('user:nickName')
        // console.log(nickNames);

        // const isPresnt = await client.sIsMember('user:nickName', 'nick1')
        // console.log(isPresnt);

        // await client.sRem('user:nickName', 'nick1')
        // console.log(await client.sMembers('user:nickName'));
        

        
        //sorted sets (weighted sets) ZADD, ZRANGE, ZRANK
        // await client.zAdd('cart',[
        //     {
        //         score:100, value:'item1'
        //     },
        //     {
        //         score:150, value:'item2'
        //     },
        //     {
        //         score:30, value:'item3'
        //     }
        // ])
        // // const cartItems = await client.zRange('cart', 0, -1 );
        // const cartItems = await client.zRangeWithScores('cart', 0, -1);
        // console.log(cartItems);

        // const cartTwoRank = await client.zRank('cart', 'item3')
        // console.log(cartTwoRank);


        //Hashed -> HSET, HGET, HGETALL, HDEL

        await client.hSet('product:1',{
            name:"Product 1",
            price:10,
            quantity:100
        })

        const getProduct = await client.hGet('product:1', 'price')
        console.log(getProduct)
        
        const getProductAll = await client.hGetAll('product:1')
        console.log(getProductAll)

        await client.hDel('product:1', 'quantity')
        console.log(await client.hGetAll('product:1'))
        
    } catch (error) {
        console.log("error occured", error);

    } finally{
        await client.quit();
    
    }
}
redisDataStructures()