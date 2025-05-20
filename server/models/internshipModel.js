const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema({
  title: { type: String },            
  role: { type: String },             
  company: { type: String },
  location: { type: String },
  duration: { type: String },
  stipend: { type: String },
  skills_required: [{ type: String }],
  application_deadline: { type: Date },
  mode: { type: String },
  link: { type: String },
  description: { type: String },

  
  applied: { type: Boolean, default: false },
  followedUp: { type: Boolean, default: false },
  interview: { type: Boolean, default: false },

  dateSaved: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Internship", InternshipSchema);
