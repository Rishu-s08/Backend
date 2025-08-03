const express = require('express')
const app = express()

app.set('view engine', 'ejs')


//routing
app.get('/about', (req, res)=>{
    res.send("asdfasd")
})

app.post('/api/data', (req, res)=>{
    res.json({
        message: 'data',
        data : req.body
    })
})

app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send('something weird happened')
    
})

app.listen(3000, () => {
    console.log("sever is running");
})