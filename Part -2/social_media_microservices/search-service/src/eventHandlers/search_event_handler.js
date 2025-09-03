const Search = require("../models/Search");
const logger = require("../utils/logger");


async function handlePostCreated(data) {
    // Implement your logic for handling post.created events
    try {
        const { postId, userId, content, createdAt } = data;

        const newSearchPost = new Search({
            postId,
            userId,
            content,
            createdAt
        });

        await newSearchPost.save();

        logger.info('Search index created for post:', postId);
    } catch (error) {
        logger.error('Error handling post.created event:', error);
    }
}

async function handlePostDeleted(data){
    try {
        await Search.findOneAndDelete({postId: data.postId});
        logger.info('Search index deleted for post:', data.postId);
    } catch (error) {
        logger.error('Error handling post.deleted event:', error);
    }
}

module.exports = { handlePostCreated, handlePostDeleted };