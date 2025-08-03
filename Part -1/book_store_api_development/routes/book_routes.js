const express = require('express')
const { getAllBooks, getOneBooks, updateBook, deleteBook, addBook } = require('../controller/controller.js')
// create express router
const router = express.Router()

//all routes that are related to books only
router.get('/get', getAllBooks)
router.get('/get/:id', getOneBooks)
router.post('/add', addBook)
router.put('/update/:id', updateBook)
router.delete('/delete/:id', deleteBook)

module.exports = router;