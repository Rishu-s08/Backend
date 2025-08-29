const logger = require('../utils/logger');
const Post = require('../models/post');

const createPost = async (req, res) => {
    try {
        const {content, mediaIds} = req.body;
        const newPost = new Post({
            user: req.user.userId,
            content: content,
            mediaIds: mediaIds || []
        })

        await newPost.save();
        logger.info('Post created successfully', newPost);
        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        logger.error('Error creating post', error);
        res.status(500).json({ message: 'Error creating post' });
    }
}

const getAllPosts = async (req, res) => {
    try {

    } catch (error) {
        logger.error('Error fetching posts', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
}

const getPostById = async (req, res) => {
    try {
        
    } catch (error) {
        logger.error('Error fetching post', error);
        res.status(500).json({ message: 'Error fetching post' });
    }
}

const deletePost = async (req, res) =>{
    try {
        
    } catch (error) {
        logger.error('Error deleting post', error);
        res.status(500).json({ message: 'Error deleting post' });
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    deletePost
}