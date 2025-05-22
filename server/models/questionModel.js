const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const referenceCodeSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ["cpp", "python", "java", "javascript"],
    // required: true,
  },
  code: {
    type: String,
    // required: true,
  }
});

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  constraints: String,
  testCases: [testCaseSchema],
  hints: [String], 
  referenceCode: [referenceCodeSchema]

});

module.exports = mongoose.model("Question", questionSchema);
