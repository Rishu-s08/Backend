const mongoose = require('mongoose')

const connectToDb = async function () {
    try {
        await mongoose.connect('mongodb+srv://rishi2030s:rishi2031s@cluster0.bz3rlbb.mongodb.net/')
        console.log("MongoDb is connected successfully");
        
    } catch (error) {
        console.log("cannot connect the db to your store", error);
        process.exit(1)
        
    }
}

module.exports = connectToDb;