const mongoose = require('mongoose')
const author = require('./author')

const bookSchema = mongoose.Schema({
    title:String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'author'
    },
})

module.exports = mongoose.model('book',bookSchema)