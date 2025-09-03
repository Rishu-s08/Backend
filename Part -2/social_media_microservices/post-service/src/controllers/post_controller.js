const logger = require('../utils/logger');
const Post = require('../models/post');
const { validateCreatePost } = require('../utils/validate');
const { clientEncryption } = require('../../../user-services/src/models/refresh_token');
const { publishEvent } = require('../utils/rabbitmq');

async function invalidateCache(req, input){

    const cachedKey = `post:${input}`;
    await req.redisClient.del(cachedKey);

    const keys = await req.redisClient.keys("posts:*");
    if(keys.length > 0){
        await req.redisClient.del(keys)
    }
}

const createPost = async (req, res) => {
    try {
        //validate the schema
        const {error} = validateCreatePost(req.body);
                if(error) {
                    logger.warn('Validation error:', error.details[0].message);
                    return res.status(400).json({ 
                        success: false,
                        error: error.details[0].message 
                    });
                }
                const {content, mediaIds} = req.body;
        const newPost = new Post({
            user: req.user.userId,
            content: content,
            mediaIds: mediaIds || []
        })

        await newPost.save();

        await publishEvent('post.created', {
            postId : newPost._id.toString(),
            userId : newPost.user.toString(),
            content : newPost.content,
            createdAt : newPost.createdAt
        })

        await invalidateCache(req, newPost._id.toString());
        logger.info('Post created successfully', newPost);
        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
        logger.error('Error creating post', error);
        res.status(500).json({ message: 'Error creating post' });
    }
}

const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const cacheKey = `posts:${page}:${limit}`;
        const cachedPosts = await req.redisClient.get(cacheKey);

        if(cachedPosts) {
            logger.info(`Cache hit for key: ${cacheKey}`);
            return res.json(JSON.parse(cachedPosts))
        }
        const posts = await Post.find().sort({createdAt : -1}).skip(startIndex).limit(limit);

        const total = await Post.countDocuments();
        const result = {
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        }

        //save your posts in redis cache
        await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));

        res.json(result);
    } catch (error) {
        logger.error('Error fetching posts', error);
        res.status(500).json({ message: 'Error fetching posts' });
    }
}

const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const cacheKey = `post:${postId}`;

        const cachedPost = await req.redisClient.get(cacheKey)
        if(cachedPost) {
            logger.info(`Cache hit for key: ${cacheKey}`);
            return res.json(JSON.parse(cachedPost));
        }

        const singlePostDetail = await Post.findById(postId);
        if(singlePostDetail) {
            await req.redisClient.setex(cacheKey, 3600, JSON.stringify(singlePostDetail));
            return res.json(singlePostDetail);
        }

        res.status(404).json({ message: 'Post not found' });
    } catch (error) {
        logger.error('Error fetching post', error);
        res.status(500).json({ message: 'Error fetching post' });
    }
}

const deletePost = async (req, res) =>{
    try {
        const deletePost = await Post.findOneAndDelete({_id : req.params.id, 
            user : req.user.userId
        });
        if(!deletePost){
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        } 

        // publish post delete method 
        await publishEvent('post.deleted', { // name of key
            postId : deletePost._id.toString(),
            userId : deletePost.user.toString(),
            mediaIds : deletePost.mediaIds
        })

        await invalidateCache(req, deletePost._id.toString());
        return res.json({
            success: true,
            message: 'Post deleted successfully'
        })

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