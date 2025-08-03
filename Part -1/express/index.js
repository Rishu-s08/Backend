const express = require ('express')
const app = express()
app.get('/', (req, res)=>{
    res.send("hioioioioioioioioio")
})

app.listen(3000, ()=>{
    console.log("sever is running");
})