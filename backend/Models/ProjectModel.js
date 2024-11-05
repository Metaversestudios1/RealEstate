const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectname: {
        type: String,
        required: true, // Ensure project name is provided
    },
    sites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site', // Reference to the Site model
    }],
    description: {
        type: String,
        default: null, // Optional field for project description
    },
    startDate: {
        type: Date,
        required: true, // Ensure start date is provided
    },
    endDate: {
        type: Date,
        default: null, // Optional field for project end date
    },
    budget: {
        type: mongoose.Types.Decimal128, // For decimal values representing the budget
        required: true, // Ensure budget is provided
    },
    status: {
        type: String,
        enum: ['Planned', 'InProgress', 'Completed', 'Hold'], // Enum for project status
        default: 'Planned', // Default status
    },
    createdAt: {
        type: Date,
        default: Date.now, // Set to current date by default
    },
    updatedAt: {
        type: Date,
        default: Date.now, 
      }// Automatically set to the current date
    } ,{ timestamps: true, collection: "project" });
    
    module.exports= mongoose.model("project",projectSchema);
    