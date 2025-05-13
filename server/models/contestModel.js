const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Codeforces', 'Codechef', 'LeetCode', 'HackerRank', 'HackerEarth', 'AtCoder']
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, 
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  problems: [{
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true
    },
    problemName: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    }
  }],
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    score: {
      type: Number,
      default: 0
    },
    rank: {
      type: Number,
      default: 0
    }
  }],
  contestCreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contestLink: {
    type: String,
    default: ''
  },
  isLive: {
    type: Boolean,
    default: false
  },
  contestType: {
    type: String,
    enum: ['Rated', 'Unrated'],
    default: 'Unrated'
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
});


const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
