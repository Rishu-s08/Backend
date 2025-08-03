const express = require('express');
const authMiddleware = require('../middleware/auth_middleware');
const adminMiddleware = require('../middleware/admin_middleware');
const router = express.Router();

router.get('/welcome',authMiddleware, adminMiddleware, (req,res)=>{
    res.json({
        message: 'welcome to the admin page'
    })
})

module.exports = router