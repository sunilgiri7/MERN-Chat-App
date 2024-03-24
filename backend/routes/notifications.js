const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;
    console.log(userId, message);

    // Create a new notification instance
    const notification = new Notification({
      userId,
      message,
    });

    // Save the notification to the database
    await notification.save();

    res.status(201).json({ success: true, notification });
  } catch (error) {
    console.error("Error saving notification:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});
module.exports = router;
