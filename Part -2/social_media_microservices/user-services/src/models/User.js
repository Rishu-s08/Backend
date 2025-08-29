const mongoose = require('mongoose')
const argon2 = require('argon2')

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim: true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase: true,
        match : [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long']
    },
    fullName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
        
    },
    profilePicture: {
        type: String,
        required: false,
        default: function() {
            return `https://ui-avatars.com/api/?name=${this.fullName}&background=random&color=random`;
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

}, { timestamps: true })

UserSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        try {
            this.password = await argon2.hash(this.password);
        } catch (error) {
            return next(error);
        }
    }
})

UserSchema.methods.comparePassword = async function(candidatePassword){
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
        throw error;
    }
}

UserSchema.index({username: 'text', email: 'text'}, {weights:{username: 5, email: 3}});
const User = mongoose.model('User', UserSchema);
module.exports = User;