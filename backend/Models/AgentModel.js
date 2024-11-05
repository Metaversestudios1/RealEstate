const mongoose = require('mongoose');

// Define the User Schema
const AgentSchema = new mongoose.Schema({
  agentname: {
    type: String,
    
  },
  agent_id:{
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  rank: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Rank model
    ref: 'Rank', // This should match the name of the Rank model
    default: null, // Nullable
  },
  
  clients: {
    type: [String], // Array of Client IDs
    default: null, // Nullable
  },
  properties: {
    type: [String], // Array of Property IDs
    default: null, // Nullable
  },
  superior: {
    type: String,
  },
  hierarchy: {
    type: String,
  }, 
  commissions: [
    {
      siteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site', // Reference to the Site model
      },
      index: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    
      balanceRemaining:{
        type: String,
      },
      percentage:{
        type: Number,
      },
      tdsDeduction:{
        type: Number,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  adhaar_id: { type: String },
  pan_id: { type: String },
  photo: {
    publicId: { type: String },
    url: { type: String },
    originalname: { type: String },
    mimetype: { type: String },
  },
  bank_details: {
    ifsc: { type: String },
    acc_type: { type: String },
    acc_holder_name: { type: String },
    bank_name: { type: String },
    acc_no: { type: String },
    branch: { type: String },
  },
  notificationCount:{
    type: Number,
    default: 0,
  },
  notificationStatus:{
    type: String,
    default:"0"
  },
  status: {
    type: Number,
    enum: [0, 1,], // 0 = inactive, 1 = active, 2 = hold
    default: 0 // Default to 'active'
},
 updatedAt: {
    type: Date,
    default: Date.now, 
  },// Automatically set to the current date
  deleted_at: {
      type: Date,
      default: null,
    },
} ,{ timestamps: true, collection: "Agent" });

module.exports= mongoose.model("Agent",AgentSchema);
