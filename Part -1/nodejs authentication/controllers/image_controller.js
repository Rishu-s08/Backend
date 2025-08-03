const Image = require('../models/image')
const uploadToCloudinary = require('../helpers/cloudinary_helper')
const cloudinary = require('../config/couldinary')

const uploadImage = async(req, res)=>{
    try {
        //check if file is missing
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: 'File is required'
            })
        }

        // upload to cloudinary
        const {url, publicId}  = await uploadToCloudinary(req.file.path)
        
        //store the image url and public id along with user id in db
        const newlyUploadedImage = new Image({
            url, 
            publicId,
            uploadedBy : req.userInfo.userId
        })
        await newlyUploadedImage.save()
        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            image: newlyUploadedImage
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({
            success  :false,
            message: 'something went wrong! please try again'
        })
    }
}

const fetchImagesController = async(req, res)=>{
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const sortBy  =req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {}
        sortObj[sortBy] = sortOrder;
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit); 
        if(images){
            res.status(200).json({
                success: true,
                totalImages,
                totalPages,
                currentPage: page,
                message: 'Images fetched',
                data: images
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'something went wrong! please try again'
        })
    }
}

const deleteImageController = async(req, res)=>{
    try {
        const getCurrentIdOfImageToBeDeleted = req.params.id;
        const imageToBeDeleted = await Image.findById(getCurrentIdOfImageToBeDeleted)

        if(!imageToBeDeleted){
            res.status(400).json({
                success: false,
                message: 'Cannot find the image with that id'
            })
        }
        if(imageToBeDeleted.uploadedBy.toString() !== req.userInfo.userId){
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this image'
            })
        }
            //delete from cloudinary
            await cloudinary.uploader.destroy(imageToBeDeleted.publicId);
            

            //delete from db
            await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted)
            res.status(200).json({
                success: true,
                message: 'Image deleted successfully'
            })
        
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'something went wrong! please try again'
        })
    }
}
module.exports ={ uploadImage, fetchImagesController, deleteImageController}