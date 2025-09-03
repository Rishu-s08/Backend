const { uploadMediaToCloudinary } = require("../utils/cloudinary");
const Media = require("../models/Media");
const logger = require("../utils/logger");

const uploadMedia = async (req, res)=>{
    logger.info("Uploading media...", { userId: req.user.id });
    try {
        if(!req.file){
            logger.error('No file found, please upload a file');
            return res.status(400).json({ error: 'No file found, please upload a file' });
        }

        const {originalname, mimetype, buffer} = req.file;
        const userId = req.user.userId;
        console.log(userId);
        

        logger.info('File received, uploading to Cloudinary...', { userId, originalname, mimetype });

        const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file);
        console.log(cloudinaryUploadResult);

        logger.info(`File successfully uploaded to Cloudinary, Public id: - ${cloudinaryUploadResult.public_id}`);

        const newlyCreatedMedia = await Media.create({
            publicId : cloudinaryUploadResult.public_id,
            originalName : originalname,
            mimeType : mimetype,
            url : cloudinaryUploadResult.secure_url,
            userId
        });

        res.status(201).json({ message: 'Media uploaded successfully', media: newlyCreatedMedia });


    } catch (error) {
        logger.error('Error uploading media', { userId: req.user.id, error });
        return res.status(500).json({ error: 'Error uploading media' });
    }
}

const getAllMedias = async (req, res) => {
    try {
        const medias = await Media.find({userId:req.user.userId}).sort({ createdAt: -1 });
        if(medias.length === 0){
            return res.status(404).json({ message: 'No media found' });
        }
        res.status(200).json({ success: true, medias });
    } catch (error) {
        logger.error('Error fetching medias', { userId: req.user.id, error });
        return res.status(500).json({ error: 'Error fetching medias' });
    }
}

module.exports = {
    uploadMedia,
    getAllMedias
};