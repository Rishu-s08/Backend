const mongoose = require('mongoose')
mongoose.connect("<connect>").then(()=>console.log("Db connected successfully")).catch((e)=>console.log(e));


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
    tags: [String],
    isActive: Boolean,
    createdAt: {type: Date, default: Date.now}
})

const userModel = mongoose.model('Users', userSchema)

async function runQuery() {
    try {
        // const newUser = await userModel.create({
        //     name: "travis",
        //     email: "traavisss@gmail.com",
        //     age: 55,
        //     tags: ["dev",],
        //     isActive: true,
        // })
        
        //also we can save with
        // const newUser = userModel({
        //     name: "newww",
        //     email: "newwww@gmail.com",
        //     age: 7034,
        //     tags: ["dev", "ds", "algo"],
        //     isActive: false,
        // })
        // await newUser.save()

        // const allUsers = await userModel.find({})
        // console.log(allUsers);
        

        // const getUserOfActiveFalse = await userModel.find({isActive:true})
        // console.log(getUserOfActiveFalse);
        
        // const getFirstUserThatMatch = await userModel.findOne({ name: "newww" })
        // console.log(getFirstUserThatMatch);

        // const getLastCreatedUserByUserId = await userModel.findById(newUser._id)
        // console.log( "by iD =>>",getLastCreatedUserByUserId);
        

        // const selectedFields = await userModel.find().select("name email -_id")  // id not included
        // console.log(selectedFields);
        
        // const limitedUser = await userModel.find().limit(5).skip(1); //limit to 5 output and skip 1st one
        // console.log(limitedUser);

        // const sortedUser  = await userModel.find().sort({age:1}) //-1 for desc and 1 for asen
        // console.log(sortedUser);

        // const countDocumentas = await userModel.countDocuments({isActive :false})
        // console.log(countDocumentas);
        
        // await userModel.findByIdAndDelete
        // await userModel.findByIdAndUpdate(newUser._id, {$set : {age:100}, $push:{tags :'updated'}},{new:true})

    } catch (error) {
        console.log("Error", e);
                
    }finally{
        await mongoose.connection.close(); 
    }
}

runQuery();
