const mongoose =require('mongoose')

const AdminSchema = new mongoose.Schema({
    email:{
        type:String,
    },
    password:{
        type:String
    },
    contact: { type: String },
    status:{
        type:Number,
        default:1,
    },
    lastLoginToken: {
        type: String, // Store the JWT or session token as a string
        default: null, // Default to null when there is no active session
      },
      lastLoginTime: {
        type: Date, // Store the timestamp of the last login
        default: null,
      },
} ,{ timestamps: true, collection: "admin" });

module.exports= mongoose.model("Admin",AdminSchema);