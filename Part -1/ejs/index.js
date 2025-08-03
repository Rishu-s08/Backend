const express = require('express')
const path = require('path')
const app = express()


//set the view engine to ejs
app.set('view engine', 'ejs')

//set dir to views
app.set('views', path.join(__dirname, 'views'))

const Product = [
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

app.get('/', (req, res)=>{
    res.render('home', {title:"home", products:Product})
})
app.get('/about', (req, res) => {
    res.render('about', { title: "about"})
})


app.listen(3000, () => {
    console.log("sever is running");
})

