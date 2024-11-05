const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property", // Reference to the Property model
     },
     site_count: { type: Number, default: 0 }, // Initialize with 0
    siteNumber: {
      type:String
    },
    status: {
      type: String,
      enum: ["Booked", "Available","Completed"], // Enum for site booking status
      default:"Available"
    },
    agentId: {
      type:String
    },
    description:{
      type: String,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client", // Reference to the Client model
    },
    propertyDetails: {
      totalValue: {
        type:Number, // Decimal valu e for the total site value
      },
      amountPaid: {
        type: Number, // Decimal value for amount paid by the client
      },
      balanceRemaining: {
        type:Number, // Decimal value for the balance remaining
      },
    },
    propertyDetailsstatus:{
      type: String,
      enum: ['1','0'], // Enum for site booking status
      default:"0"
    },
    saleDeedDetails: {
      deedNumber: {
        type: String,
      },
      executionDate: {
        type: Date,
      },
      buyer: {
        type: String,
      },
      seller: {
        type: String,
      },
     
      saleAmount: {
        type: Number,
      },
      witnesses: {
        type: String, // Array of witness names
      },
      registrationDate: {
        type: Date,
        default: null, // Nullable for registration date
      },
    },
    payments: [{ // New field for payments
      amount: {
        type: Number,
        required: true, // Make amount required
      },
      date: {
        type: Date,
        default: Date.now, // Automatically set to current date
      },
    }],
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set to current date
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically set to current date
    },
  },
  { timestamps: true, collection: "site" }
);

module.exports = mongoose.model("Site", siteSchema);
