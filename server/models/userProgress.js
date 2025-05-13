const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  followedSheets: [String], // e.g., ["Striver", "NeetCode"]
  progress: {
    Striver: {
      completed: Number,
      total: Number,
      currentTopic: String,
    },
    NeetCode: {
      completed: Number,
      total: Number,
      currentTopic: String,
    },
    LoveBabbar: {
      completed: Number,
      total: Number,
      currentTopic: String,
    },
  },
});

module.exports = mongoose.model("UserProgress", userProgressSchema);
