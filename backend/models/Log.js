const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: null,
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Log", logSchema);
