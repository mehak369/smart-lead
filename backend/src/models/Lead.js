const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: { type: String },
    probability: { type: Number },
    status: { type: String },
    syncedToCRM: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
