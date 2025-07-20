require('dotenv').config()
const express = require('express')
const connectToDb = require('./database/db')
const authRoutes = require('./routes/auth_routes')
const app = express()
const homeRoutes  =require('./routes/home_routes')
const adminRoutes  =require('./routes/admin_routes')
const PORT = process.env.PORT || 3000


//connect to DB
connectToDb()


app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/home", homeRoutes)
app.use("/admin",adminRoutes)

app.listen(PORT, ()=>{
    console.log("server is listening")
})