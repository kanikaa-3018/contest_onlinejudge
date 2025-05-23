const jwt =require("jsonwebtoken");
const User =require('../models/userModel.js');
const dotenv=require("dotenv");
dotenv.config()
const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  console.log('Token:', token);

  if (!token) return res.status(401).json({ message: 'Not authorized - no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:', decoded);

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'Not authorized - user not found' });

    next();
  } catch (error) {
    console.error('JWT error:', error.message);
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};


module.exports={protect}