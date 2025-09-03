const { log } = require("winston");
const logger = require('../utils/logger');
const Media = require("../models/Media");
const { deleteMediaFromCloudinary } = require("../utils/cloudinary");


const handlePostDeleted = async (data) => {
    logger.info('Handling post.deleted event:', data);
    
    // Add your event handling logic here

    const {postId, mediaIds} = data;
    try {
        const mediaToDelete = await Media.find({_id:{$in: mediaIds}});
        for(const media of mediaToDelete){
            await deleteMediaFromCloudinary(media.publicId);
            await Media.findByIdAndDelete(media._id);

            logger.info(`Successfully deleted media ${media._id} for postId: ${postId}`);
        }
        logger.info(`Successfully handled post.deleted event for postId: ${postId}`);

    } catch (error) {
        logger.error('Error handling post.deleted event', { error });
    }
};

module.exports = handlePostDeleted

