//custom error class
class APIError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.name = 'APIError'; //set the error type to api error
    }
}

const asyncHandler = (fn)=>(req, res, next)=>{
    Promise.resolve(fn(req, res, next)).catch(next)
}

const globalErrorHandler = (err, req, res, next)=>{
    console.error(err.stack); //log the error stack
    console.log('Error constructor:', err.constructor.name);
    console.log('Is APIError:', err instanceof APIError);
    console.log(err);

    if(err instanceof APIError){
        return res.status(err.statusCode).json({status: 'error', message: err.message})
    
    }

    //handle mongoose validation
    else if(err.name === 'validationError'){
        return res.status(400).json({status: 'error', message: err.message})
    }
    else {
        return res.status(500).json({status: 'error', message: 'Internal server error'})
    
    }
}

module.exports = {APIError, asyncHandler, globalErrorHandler}