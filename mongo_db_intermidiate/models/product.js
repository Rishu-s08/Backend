const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name:String,
    category:String,
    price:Number,
    inStock:Boolean,
    tags:[String]
})


module.exports = mongoose.model('product',ProductSchema)