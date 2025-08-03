const bookModel = require('../models/model')

const getAllBooks = async (req, res)=>{
    try {
        const books = await bookModel.find();
        if(books?.length > 0){
            res.status(200).json({
                success: true,
                message: 'all Books fetched successfully',
                data: books
            })
      
        }  else{
            res.status(404).json({
                message: "No book found in DB"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'something went wrong please try again',
        })
    }
}
const getOneBooks = async (req, res)=>{
    try {
        const book = await bookModel.findById(req.params.id);
        if (book) {
            res.status(200).json({
                success: true,
                message: 'Book with Id fetched successfully',
                data: book
            })

        } else {
            res.status(404).json({
                message: "No book found with that Id in DB"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'something went wrong please try again',
        })
    }
}
const updateBook = async (req, res)=>{
    try {
        const updatedBookFormData = req.body
        const book = await bookModel.findByIdAndUpdate(req.params.id, updatedBookFormData, {new: true});
        if (book) {
            res.status(200).json({
                success: true,
                message: 'Book with Id updated successfully',
                data: book
            })

        } else {
            res.status(404).json({
                message: "No book found with that Id in DB"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'something went wrong please try again',
        })
    }
}
const deleteBook = async (req, res)=>{
    try {
        const book = await bookModel.findByIdAndDelete(req.params.id);
        if (book) {
            res.status(200).json({
                success: true,
                message: 'Book with Id deleted successfully',
                data: book
            })

        } else {
            res.status(404).json({
                message: "No book found with that Id in DB"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'something went wrong please try again',
        })
    }
}
const addBook = async (req, res)=>{
    try {
        const newBookFormData = req.body;
        const newlyCreatedBook = await bookModel.create(newBookFormData)
        if(newlyCreatedBook){
            res.status(200).json({
                success : true,
                message: 'Book added successfully',
                data: newlyCreatedBook
            })
        } else {
            res.status(404).json({
                message: "Book cant be added "
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'something went wrong please try again',
        })
    }
}

module.exports = {getAllBooks, getOneBooks, updateBook, deleteBook, addBook}