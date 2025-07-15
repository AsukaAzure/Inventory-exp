const Log = require("../models/Log");

// Create a new log entry
const createLog = async (req, res) => {
  try {
    const { username, activity, count, createdBy, updatedBy } = req.body;
    const log = new Log({ username, activity, count, createdBy, updatedBy });
    await log.save();
    res.status(201).json({ message: "Log created", log });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all logs
const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getLogs,
  createLog 
};
