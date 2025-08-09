const configureCors = require('./config/corsConfig')
const express = require('express')
const { reqLogger, addTimestamp } = require('./middleware/custom_middleware')
const { globalErrorHandler } = require('./middleware/error_handler')
const { urlVersioning } = require('./middleware/api_versioning')
const createBasicRateLimiter = require('./middleware/rate_limiting')
const itemRoutes = require('./routes/item_routes')

const app = express()

app.use(reqLogger)
app.use(addTimestamp)

app.use(configureCors())
app.use(createBasicRateLimiter(100, 15 * 60 * 1000))
app.use(express.json())

app.use(urlVersioning("v1"))
app.use("/api/v1", itemRoutes)

app.use(globalErrorHandler)


app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is now listening");
})