const express = require("express");
const router = express.Router();
const User = require("../models/User");

// CREATE USER (with auto-generated profile link)
router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const newUser = await User.create({
      username,
      email
    });

    res.status(201).json({
      user: newUser,
      profileLink: `http://localhost:5000/u/${username}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET USER BY USERNAME
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;