const { get } = require('mongoose');
const Author = require('../models/author')
const Book = require('../models/book')

const createAuthor = async(req, res)=>{
    try {
        const author = await Author.create(req.body);
        res.status(201).json({
            success:true,
            data:author
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const createBook = async(req, res)=>{
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json({
            success:true,
            data:book
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getBookWithAuthor = async(req, res)=>{

    try { 
        const book = await Book.findById(req.params.id).populate('author') // now this popualte author will replace the author ref with full author document not just the id
        res.status(200).json({
            success:true,
            data:book
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }

}

module.exports = {createAuthor, createBook, getBookWithAuthor}