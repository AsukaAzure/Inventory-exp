const mongoose = require("mongoose")

const PasswordChangeRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  email: { type: String, required: true },
  requestedPassword: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
})

module.exports = mongoose.model("PasswordChangeRequest", PasswordChangeRequestSchema)
