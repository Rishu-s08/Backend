const logger = require('../utils/logger');
const { validateRegistration, validateLogin } = require('../utils/validator');
const User = require('../models/User');
const generateToken = require('../utils/generate_token');
const RefreshToken = require('../models/refresh_token');

// user registration
const registerUser = async(req, res) => {
    logger.info('User registration started');
    // registration logic
    try {
        //validate the schema
        const {error} = validateRegistration(req.body);
        if(error) {
            logger.warn('Validation error:', error.details[0].message);
            return res.status(400).json({ 
                success: false,
                error: error.details[0].message 
            });
        }
        const {email, password, username, fullName} = req.body;

        let user = await User.findOne({ $or: [{email}, {username}]});
        if(user){
            logger.warn('User already exists:', user);
            return res.status(400).json({
                success: false,
                error: 'User with this email or username already exists'
            });
        }
        
        user = new User({
            email,
            password,
            username,
            fullName
        })

        await user.save();
        logger.info('User registration successful:', user._id);

        const {accessToken, refreshToken} = await generateToken(user);

        res.status(201).json({
            success: true,
            data: user,
            accessToken,
            refreshToken
        });


    } catch (error) {
        logger.error('Error during user registration:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }


}

// user login
const loginUser = async(req, res) => {
    logger.info('User login started');
    try {
        const {error} = validateLogin(req.body);
        if(error) {
            logger.warn('Validation error:', error.details[0].message);
            return res.status(400).json({
                success: false,
                error: error.details[0].message
            });
        }
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            logger.warn('User not found:', email);
            return res.status(404).json({
                success: false,
                error: 'Invalid email or password'
            });
        }
        //validate the password
        const validPass = await user.comparePassword(password);
        if(!validPass) {
            logger.warn('Invalid password attempt for user:', email);
            return res.status(400).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        const {accessToken, refreshToken} = await generateToken(user);

        res.json({
            success: true,
            data: user,
            accessToken,
            refreshToken
        });


    } catch (error) {
        logger.error('Error during user login:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}

//refresh token
const refreshTokenUser = async(req, res)=>{
    logger.info('Refresh token generation started');

    try {
        const {refreshToken} = req.body;
        if(!refreshToken) {
            logger.warn('Refresh token not provided');
            return res.status(400).json({
                success: false,
                error: 'Refresh token is required'
            });
        }

        const storedToken = await RefreshToken.findOne({token: refreshToken});

        if(!storedToken || storedToken.expiresAt < new Date()){
            logger.warn('Invalid or expired refresh token:', refreshToken);
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired refresh token'
            });
        }

        const user = await User.findById(storedToken.user)
        if(!user) {
            logger.warn('User not found for refresh token:', refreshToken);
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const {accessToken : newAccessToken, refreshToken : newRefreshToken} = await generateToken(user);

        // Delete the old refresh token
        await RefreshToken.deleteOne({
            _id: storedToken._id
        })

        res.json({
            success: true,
            data: user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        });

    } catch (error) {
        logger.error('Error during user login:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}


//logout
const logoutUser = async(req, res)=>{
    logger.info('User logout started');
    try {
        const {refreshToken} = req.body;
        if(!refreshToken) {
            logger.warn('Refresh token not provided');
            return res.status(400).json({
                success: false,
                error: 'Refresh token is required'
            });
        }

        await RefreshToken.deleteOne({ token: refreshToken });
        logger.info('User logged out successfully:', refreshToken);

        res.json({
            success: true,
            message: 'User logged out successfully'
        });

    } catch (error) {
        logger.error('Error during user logout:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}


module.exports = {
    registerUser,
    loginUser,
    refreshTokenUser,
    logoutUser
};