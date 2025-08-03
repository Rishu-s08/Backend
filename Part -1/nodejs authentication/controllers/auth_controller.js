const User = require("../models/user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// register controller
const registerUser = async (req, res) => {
 
    try {
        //extract user info from our body
        const {username, email, password, role} = req.body

        //check if user is already exists in our database
        const checkExistingUser = await User.findOne({$or : [{username}, {email}]})
        if(checkExistingUser){
            return res.status(400).json({
                status: false,
                message:"user is already exists with same username or same email"
            })
        }
        
        //hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)
        

        //create a new user and save in your database
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPass,
            role: role || 'user'
        })

        await newlyCreatedUser.save();

        if(newlyCreatedUser){
            res.status(201).json({
                status: true,
                message: "User registered succesfully"
            })

        }
        else{
            res.status(400).json({
                status: true,
                message: "Unable to register user"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot register you with the app, Some error occured"
        })
    }
    
}
// login controller
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body

        //find if the current user is exist in the db or not
        const user = await User.findOne({username})

        if(!user){
            res.status(400).json({
                success: false,
                message: "Username or password is incorrect"
            })
        }else{
            const isPassMatch = await bcrypt.compare(password, user.password);
            if(!isPassMatch){
                res.status(400).json({
                    success: false,
                    message: "Username or password is incorrect"
                })
            }

            //create user token
            const accessToken = jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET_KEY, {
                expiresIn:"15m"
            })

            res.status(200).json({
                success: true,
                message:'logged in succesfull',
                role : user.role,
                accessToken
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot login you with the app, Some error occured"
        })
    }
}

const changePassword = async (req, res)=>{
    try {
        const userId = req.userInfo.userId;
        // console.log(userId);
        
        const user = await User.findById(userId);
        // console.log(user);
        if(!user){
            return res.status(500).json({
                message: "User not found"
            })
        }
        
        const {newPassword, oldPassword} = req.body;
                
        const isPassMatch = await bcrypt.compare(oldPassword, user.password)

        if(isPassMatch){
            const salt = await bcrypt.genSalt(10);
            // console.log("newPassword:", typeof newPassword, newPassword, "salt:", typeof salt, salt);
            const hashedPass = await bcrypt.hash(newPassword, salt);
            user.password = hashedPass;
            await user.save();
            res.status(200).json({ // Corrected status code to 200 for success
                success:true,
                message: "Password changed succesfully"
            })

        }else{
            return res.status(400).json({ // Corrected status code to 400 for bad request
                message: "Your current password does not match" // Improved error message
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Cannot change the pass, Some error occured"
        })
    }
}

module.exports = {registerUser, loginUser, changePassword}