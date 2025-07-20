const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
        maxLength: [100, "Book title can not be more thean 100 cha"]
    },
    author: {
        type: String,
        required: [true, "Book author name is required"],
        trim: true,
    },
    year: {
        type: Number,
        required: [true, "Book published year is required"],
        min : [1000, 'Year must be atleast 1000'],
        max : [new Date().getFullYear(), 'Year cannot be in Future']
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

module.exports = mongoose.model("Book", bookSchema)