const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    user_id: {
      type: String,
      unique: true,
    },
    contact: { type: String},
    password: {
      type: String,
    },
    email: {
      type: String,
      unique:true
    },
    balance: {
      type: Number,
      default:0
    },
    last_recharge:{
      type: Number,
      default:0
    },
    promocode:{
      type: String,
    },
    resetOtp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    status: {
      type: Number,
      default: 1, // Tinyint equivalent
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "user" }
);

module.exports = mongoose.model("user", UserSchema);
