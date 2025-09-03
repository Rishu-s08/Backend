const express = require('express');
const { authenticateRequest } = require('../middleware/auth_middleware');
const {searchPostController} = require('../controllers/search_controller');


const router = express.Router();

router.use(authenticateRequest)

router.get('/posts', searchPostController);


module.exports = router;