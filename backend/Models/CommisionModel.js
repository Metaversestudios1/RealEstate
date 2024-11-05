const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent', // Foreign key to Agent model
    required: true
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property', // Foreign key to Property model
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically sets the updatedAt field to the current date/time
  },
} ,{ timestamps: true, collection: "Commission" });

module.exports= mongoose.model("Commission",commissionSchema);
