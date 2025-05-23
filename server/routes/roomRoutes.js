const express = require("express");
const router = express.Router();
const {
  createRoom,
  getAllRooms,
  getRoomById,
  joinRoom,
  leaveRoom,
  getMyRooms,
  searchRooms,
} = require("../controllers/roomController");
const { protect } = require("../middlewares/authMiddlewareRoom.js");

// Create a room
router.post("/create",protect, createRoom);

// Get all public rooms
router.get("/", getAllRooms);

// Get rooms created by the logged-in user
router.get("/my", getMyRooms);

// Search rooms
router.get("/search", searchRooms);

// Get room by ID
router.get("/:id", getRoomById);

// Join room
router.post("/:id/join", protect, joinRoom);

// Leave room
router.post("/:id/leave", protect, leaveRoom);

module.exports = router;
