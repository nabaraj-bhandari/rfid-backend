const express = require("express");
const Log = require("../models/Log");

const router = express.Router();

// Get all logs
router.get("/", async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new log (used by ESP32)
router.post("/", async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: "UID is required" });
  }

  try {
    const newLog = new Log({ uid });
    await newLog.save();

    // Send real-time update to clients
    req.io.emit("new-log", newLog);

    res.status(201).json(newLog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
