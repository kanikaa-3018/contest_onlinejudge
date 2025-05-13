const express = require('express');
const { registerUser, loginUser, updateUser, getUserProfile } = require('../controllers/userControllers.js');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile/:id', updateUser);
router.get('/profile/:id', getUserProfile);

module.exports = router;
