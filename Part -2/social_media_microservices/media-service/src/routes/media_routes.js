const express = require('express');
const multer = require('multer');
const { authenticateRequest } = require('../middleware/auth_middleware');
const logger = require('../utils/logger');
const { uploadMedia, getAllMedias } = require('../controllers/media_controllers');


const router = express.Router();


//config multer
const storage = multer.memoryStorage();
const upload = multer({
     storage,
     limits: { 
        fileSize: 5 * 1024 * 1024 
    } 
}).single('file');


router.post('/upload', authenticateRequest, (req, res, next)=>{
    upload(req, res, function(err){
        if (err instanceof multer.MulterError) {
            logger.error('Multer error during file upload', { userId: req.user.id, error: err });
            return res.status(400).json({ success: false, error: 'File upload failed', stack: err.stack });
        } else if (err) {
            logger.error('Error during file upload', { userId: req.user.id, error: err });
            return res.status(500).json({ success: false, error: 'Internal server error', stack: err.stack });
        }

        if(!req.file){
            logger.error('No file uploaded', { userId: req.user.id });
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        next();
    });
}, uploadMedia);


router.get('/get', authenticateRequest, getAllMedias);

module.exports = router;