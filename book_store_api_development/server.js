require('dotenv').config()

const express = require('express')
const connectToDb = require('./database/db')
const bookRoutes = require('./routes/book_routes')

const app = express()

const PORT = process.env.PORT || 3000;

//connect to db
connectToDb()

//middleware
app.use(express.json())

//routes here
app.use('/api/books', bookRoutes)

app.listen(PORT, ()=>{
    console.log(":server is running");
    
})

