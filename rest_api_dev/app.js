const express = require('express')
const path = require('path')
const { title } = require('process')
const app = express()

app.use(express.json())

let books = [
    {
        id: 1,
        title: "book 1", 
    }, {
        id: 2,
        title: "book 2",
    }
]

//intro route
app.get('/', (req, res) =>{
    res.json({
        message: "Welcome to our bookstore api"
    })
})

//get all books
app.get('/get', (req, res)=>{
    res.json(books)
})

//get a single book
app.get('/get/:id', (req, res)=>{
    single_book = books.find((item)=> item.id == req.params.id);
    if(single_book){
        res.json(single_book)

    }else{
        res.status(404).send("Book Not Found!")
    }
})

// add a book
app.post('/add', (req, res)=>{
    new_book = {
        id : books.length + 1,
        title : `book ${books.length +1}`
    }
    books.push(new_book)
    res.json({yoyo: "New book been added", data: new_book})
})

app.post('/delete/:id',(req, res)=>{
    deletedBookIndex = books.findIndex((book)=>book.id == req.params.id)
    console.log(deletedBookIndex);
    
    if(deletedBookIndex !== -1){
        deletedBook = books.splice(deletedBookIndex, 1)
        res.status(200).json({
            message: "book has been deleted thanks for using our servies", 
            data : deletedBook
        })
    }else{
        res.status(404).send("cannot delete the book you requested")
    }
})

app.put('/update/:id', (req,res)=>{
    findCurrentBook = books.find((ele) => ele.id == req.params.id);
    if(findCurrentBook){
        findCurrentBook.title = req.body.title || findCurrentBook.title

        res.status(200).json({
            message : ` Book with Id ${findCurrentBook.id}, changed the title`, 
            data: findCurrentBook
        })
    }else{
        res.status(404).send("cant update the book")
    }
} )
app.listen(3000, ()=>{
    console.log("server running");
    
})