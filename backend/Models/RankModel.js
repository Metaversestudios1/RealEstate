const mongoose = require("mongoose");

const rankSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Name of the rank (e.g., Junior Agent, Senior Agent)

    commissionRate: { type: String, required: true }, // Commission rate associated with this rank
    description: { type: String }, // Optional description for the rank
    level: { type: Number, required: true },  // Rank level (e.g., 1 for Junior Agent, 2 for Senior Agent)
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically sets the updatedAt field to the current date/time
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true, collection: "rank" }
);

module.exports = mongoose.model("Rank", rankSchema);
