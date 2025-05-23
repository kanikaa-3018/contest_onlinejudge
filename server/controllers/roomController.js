const Room =require("../models/roomModel.js");

// POST /api/rooms/create
 const createRoom = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;

    const room = await Room.create({
      name,
      isPrivate,
      createdBy: req.user._id,
      users: [req.user._id],
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create room' });
  }
};

// GET /api/rooms
 const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false }).populate('users', 'name email');
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch rooms' });
  }
};

// GET /api/rooms/:id
 const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('users', 'name email');

    if (!room) return res.status(404).json({ message: 'Room not found' });

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch room' });
  }
};

// POST /api/rooms/:id/join
 const joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) return res.status(404).json({ message: 'Room not found' });

    if (!room.users.includes(req.user._id)) {
      room.users.push(req.user._id);
      await room.save();
    }

    res.status(200).json({ message: 'Joined room', room });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join room' });
  }
};

// POST /api/rooms/:id/leave
 const leaveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.users = room.users.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );

    await room.save();

    res.status(200).json({ message: 'Left room' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to leave room' });
  }
};

module.exports={createRoom,getAllRooms,getRoomById,joinRoom,leaveRoom}