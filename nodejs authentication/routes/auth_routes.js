const express = require('express')

const router = express.Router()
const {registerUser, loginUser, changePassword} = require('../controllers/auth_controller')
const authMiddleware = require('../middleware/auth_middleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/change-password',authMiddleware,  changePassword)

module.exports = router