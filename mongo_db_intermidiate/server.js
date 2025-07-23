//understanding the aggreagation pipeline
//using common aggregation operators
//understading document refrences 
//populating referenced documents
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoute = require('./routes/product_route');
const bookRoute = require('./routes/book_route');

const PORT = process.env.PORT;


mongoose.connect(process.env.MONGO_URI).then(()=>
    console.log("db connected")
).catch((e)=>console.log(e));



const app = express();
app.use(express.json())
app.use('/api/products', productRoute)
app.use('/api/reference', bookRoute)


app.listen(PORT, ()=>{
    console.log("server is listening");
    
})
