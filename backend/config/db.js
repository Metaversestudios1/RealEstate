const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () =>{
    try{
          await mongoose.connect(process.env.MONGODB_URI);
        // await mongoose.connect("mongodb://localhost:27017/AJV");
        console.log('mongdb connected');

    }catch(error){
        if(error.message.includes('database exists')){
            console.log('database already exist');
        } else {
            console.error('error connecting to mongodb',error.message);
        }
        process.exit(1);
    }
}

module.exports = connectDB;