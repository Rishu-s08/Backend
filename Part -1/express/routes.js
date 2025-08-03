const express = require('express')
const app = express()


app.get('/about', (req, res) => {
    res.send("asdfasd")
})
app.get('/products', (req, res) => {
    let Product = [
        {
            "id":1,
            "label" : "Product 1"
        }, {
            "id": 1,
            "label": "Product 1"
        }, {
            "id": 1,
            "label": "Product 1"
        }
    ]

    res.json(Product)
})


//get a single product
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id)
    let Product = [
        {
            "id": 1,
            "label": "Product 1"
        }, {
            "id": 2,
            "label": "Product 1"
        }, {
            "id": 3,
            "label": "Product 1"
        }
    ]

    const getSingleProduct = Product.find(product=>product.id===productId)

    if(getSingleProduct){
        res.json(getSingleProduct)
    }else{
        res.status(404).send("no product")
    }
})


app.listen(3000, () => {
    console.log("sever is running");
})