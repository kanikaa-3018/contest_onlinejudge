const mongoose =require('mongoose') ;

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  codeSnapshot: {
    type: String,
    default: '', // Optional: You can store latest code state here
  },
  documentSnapshot: {
    type: String,
    default: '', // Optional: For shared documentation
  },
});

  
  module.exports=mongoose.model('Room', roomSchema);
