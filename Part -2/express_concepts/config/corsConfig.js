const cors = require('cors')

const configureCors = ()=>{
    return cors({
        //origin -> this will tell you that which origin can access your api
        origin : (origin, callback)=>{
            const allowedOrigin = [
                'http://localhost:3000','https://customdomain.com'
            ]
            if(!origin || allowedOrigin.indexOf(origin) !== -1){
                callback(null, true)
            }else{
                callback(new Error('Not allowed by cors'))
            } 
        },
        methods : ['GET','POST', 'PUT', 'DELETE'],
        allowedHeaders : ['Content-Type', 'Authorization','Accept-Version'],
        exposedHeaders : ['Content-Range', 'X-Total-Count'], //headers those are exposed to the client
        credentials : true, // enable the support to cookies
        preflightContinue : false,
        optionsSuccessStatus : 204,
        maxAge : 600,
    })
}

module.exports = configureCors;