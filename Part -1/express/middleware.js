const express = require('express')
const app = express()

const middleware = (req, res, next)=>{
    console.log("runs on every request");
    next()
}


app.use(middleware)

app.get('/', (req, res) => {
    res.send("asdfasd")
})
app.listen(3000, () => {
    console.log("sever is running");
})
