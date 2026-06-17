const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  senderEmail: {
    type: String,
    required: true
  },
  receiverUsername: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Message", messageSchema);