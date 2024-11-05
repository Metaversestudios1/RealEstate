const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    propertyname: {
        type: String,    
    }, 
    status: {
        type: String,
        enum: ['Booked', 'Available'], // Enum for property status
        default: "Available"
    },
    description: {
        type: String,
        default: null, // Optional field for property description
    },
    address: {
        type: String,
    },
    sites: {
        type: Number,
    },
    photos: [
        {
          publicId: { type: String },
          url: { type: String },
          originalname: { type: String },
          mimetype: { type: String },
        },
      ],
    updatedAt: {
        type: Date,
        default: Date.now, 
      }// Automatically set to the current date
    } ,{ timestamps: true, collection: "property" });
    
    module.exports= mongoose.model("Property",propertySchema);
    