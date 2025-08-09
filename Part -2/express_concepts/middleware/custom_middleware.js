

const reqLogger = (req, res, next)=>{
    const timestamp = new Date().toDateString();
    const method = req.method;
    const url = req.url;
    const userAgent = req.get('User-Agent');
    console.log(`${timestamp} ${method} ${url} - ${userAgent}`);
    next()   
}

/*🔧 req.anything in Express.js

When you do something like:

req.anything = value;

You're adding a custom property to the req (request) object.

This property:

    Lives only for that request.

    Can be used in any middleware or route handler that comes after. */

const addTimestamp = (req , res, next)=>{
    req.timestamp = new Date().toISOString();
    next()
}

module.exports = {reqLogger, addTimestamp};