const express = require('express')
const authMiddleware = require('../middleware/auth_middleware');
const adminMiddleware = require('../middleware/admin_middleware');
const multerMiddleware = require('../middleware/image_middleware');
const {uploadImage, fetchImagesController, deleteImageController} = require('../controllers/image_controller');
const router = express.Router()

//upload
router.post('/upload', authMiddleware, adminMiddleware, multerMiddleware.single('image'), uploadImage)


//to get all image
router.get('/get', authMiddleware, fetchImagesController)


//to delete image
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImageController)


module.exports = router
