const express = require('express')
const router = require('./auth_routes')
const authMiddleware = require('../middleware/auth_middleware')

router.get('/welcome', authMiddleware, (req, res)=>{
    const {username, userId, role} = req.userInfo;
    res.json({
        message : "Welcome to home route",
        user : {
            _id : userId,
            username: username,
            role : role
        }
    })
})

module.exports  = router