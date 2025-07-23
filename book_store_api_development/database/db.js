const mongoose = require('mongoose')

const connectToDb = async function () {
    try {
        await mongoose.connect('')
        console.log("MongoDb is connected successfully");
        
    } catch (error) {
        console.log("cannot connect the db to your store", error);
        process.exit(1)
        
    }
}

module.exports = connectToDb;
