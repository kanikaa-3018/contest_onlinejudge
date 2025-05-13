const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  handles: {
    codechef: { type: String, default: '' },
    codeforces: { type: String, default: '' },
    leetcode: { type: String, default: '' },
    hackerrank: { type: String, default: '' },
    hackerearth: { type: String, default: '' },
    atcoder: { type: String, default: '' },
  },
  ratings: {
    type: Map,
    of: Number,
    default: {}
  },
  maxRating: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  totalQuestionsSolved: {
    type: Number,
    default: 0
  },
  questionsSolvedByPlatform: {
    codechef: { type: Number, default: 0 },
    codeforces: { type: Number, default: 0 },
    leetcode: { type: Number, default: 0 },
    hackerrank: { type: Number, default: 0 },
    hackerearth: { type: Number, default: 0 },
    atcoder: { type: Number, default: 0 }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  accountCreated: {
    type: Date,
    default: Date.now
  },
  streak: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String
  }],
  profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  activityLogs: [{
    type: String
  }],
  subscriptionStatus: {
    type: String,
    enum: ['free', 'premium', 'expired'],
    default: 'free'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
