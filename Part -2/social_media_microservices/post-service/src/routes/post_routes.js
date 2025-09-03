const express = require('express');
const {createPost, deletePost, getAllPosts, getPostById} = require('../controllers/post_controller');
const { authenticateRequest } = require('../middleware/auth_middleware');

const router = express.Router();

//middleware -> this will tell if the user is authenticated or not

router.use(authenticateRequest)

router.post('/create', createPost);
router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.delete('/delete/:id', deletePost);

module.exports = router;
