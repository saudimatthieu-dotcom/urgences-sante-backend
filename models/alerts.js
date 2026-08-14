const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
});

const alertSchema = mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  location: locationSchema,
  status: {
    type: String,
    enum: ["pending", "accepted", "onSite", "resolved", "cancelled"],
    default: "pending",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "firstResponders",
    default: null,
  },
  firstResponder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "firstResponders",
    default: null,
  },
  acceptedAt: Date,
  createdAt: { type: Date, default: Date.now },
  resolvedAt: Date,
});

const Alert = mongoose.model("alerts", alertSchema);

module.exports = Alert;
