const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  constraints: String,
  testCases: [testCaseSchema],
});

module.exports = mongoose.model("Question", questionSchema);
