const mongoose = require('mongoose')

const authorSchema = mongoose.Schema({
    name:String,
    bio:String,
})

module.exports = mongoose.model('author',authorSchema)