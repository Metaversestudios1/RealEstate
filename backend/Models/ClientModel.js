const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    clientname: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    client_id: {
      type: String,
    },
    bookedProperties: {
      type: String,
    },
    email: {
      type: String,
      unique: true, // Ensures no duplicate email addresses
    },
    address: {
      type: String,
    },
    password: {
      type: String,
    },
    preferredPropertyType: {
      type: String,
    },
    budget: {
      type: String, // Use Decimal128 for budget
      default: null,
    },
    notes: {
      type: String,
    },
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
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
    },
    occupation: {
      type: String,
    },
    notificationCount:{
      type: Number,
      default: 0,
    },
    notificationStatus:{
      type: String,
      default:"0"
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically sets the updatedAt field to the current date/time
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "client" }
);

module.exports = mongoose.model("Client", clientSchema);
