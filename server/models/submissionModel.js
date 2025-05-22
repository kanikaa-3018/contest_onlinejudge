const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true },
    status: {
      type: String,
      enum: ["Success", "Failed"],
      required: true
    },
    code: String,
    language: String,
    submittedAt: { type: Date, default: Date.now }
  });
  
  submissionSchema.index({ userId: 1, questionId: 1 }, { unique: true });
  
  module.exports = mongoose.model("Submission", submissionSchema);
  