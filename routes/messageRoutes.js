const express = require("express");
const router = express.Router();
const Message = require("../models/message");

// =========================
// AUTH MIDDLEWARE
// =========================
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "You must be logged in" });
}

// =========================
// SEND MESSAGE (PROTECTED)
// =========================
router.post("/send", isLoggedIn, async (req, res) => {
  try {
    const { receiverUsername, message } = req.body;

    const newMessage = await Message.create({
      senderEmail: req.user.email,      // from Google login
      senderUsername: req.user.name,    // from Google login
      receiverUsername,
      message
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =========================
// GET MESSAGES FOR USER (INBOX)
// =========================
router.get("/:receiverUsername", async (req, res) => {
  try {
    const messages = await Message.find({
      receiverUsername: req.params.receiverUsername
    }).sort({ createdAt: -1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;