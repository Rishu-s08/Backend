


const urlVersioning = (version)=>(req, res, next)=>{
    
    if(req.path.startsWith(`/api/${version}`)){
        next()
    }else{
        res.status(404).json({
            status:'error',
            message:'API version is not supported'
        })
    }
}

const headerVersioning = (vesion) => (req, res, next)=>{

    if(req.get('Accept-Version')===version){
        next()
    } else {
        res.status(404).json({
            status: 'error',
            message: 'API version is not supported'
        })
    }
}

const contentTypeVersioning = (version) => (req, res, next)=>{
    const contentType = req.get('Content-Type');
    if(contentType && contentType.startsWith(`application/vnd.api.${version}+json`)){
        next()
    } else {
        res.status(404).json({
            status: 'error',
            message: 'API version is not supported'
        })
    }
}

module.exports = {urlVersioning, headerVersioning, contentTypeVersioning}

