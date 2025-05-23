const express =require("express");
const {
  createRoom,
  getAllRooms,
  getRoomById,
  joinRoom,
  leaveRoom,
} =require('../controllers/roomController.js') ;

const { protect } =require('../middlewares/authMiddlewareRoom.js') ;

const router = express.Router();
// Create a room
router.post('/create', protect, createRoom);

// Get all public rooms
router.get('/', protect, getAllRooms);

// Get single room by ID
router.get('/:id', protect, getRoomById);

// Join a room
router.post('/:id/join', protect, joinRoom);

// Leave a room
router.post('/:id/leave', protect, leaveRoom);

module.exports = router;
