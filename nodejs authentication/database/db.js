const mongoose = require('mongoose')

const uri = process.env.mongo_uri
connectToDb = async function(){
    try {
        mongoose.connect(uri)
        console.log("Database connection been successful");

    } catch (error) {
        console.log("cannot connect to DB", error);
        process.exit(1)
    }
}

module.exports = connectToDb