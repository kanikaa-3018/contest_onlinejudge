const { Server } = require("socket.io");

let io;

const usersInRoom = new Map();

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    socket.on("join-room", ({ roomId, user }) => {
      if (!roomId || !user || !user.id) {
        socket.emit("error", "Invalid join-room data");
        return;
      }
      // console.log(user)

      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = user.id;
      socket.user = user;

      if (!usersInRoom.has(roomId)) {
        usersInRoom.set(roomId, new Map());
      }

      const roomUsers = usersInRoom.get(roomId);
      // console.log("rrom",roomUsers)
      if (roomUsers.has(user.id)) {
        socket.emit("error", "User already connected in this room.");
        return;
      }

      roomUsers.set(user.id, { ...user, online: true });

      // Emit updated user list to everyone in room
      const allUsers = Array.from(roomUsers.values());
      socket.to(roomId).emit("room-users", allUsers);
      io.to(roomId).emit("room-users", allUsers);

      console.log(`👤 ${user.name} (id: ${user.id}) joined room ${roomId}`);
    });

    socket.on("leave-room", ({ roomId, user }) => {
      if (!roomId || !user || !user.id) return;
      socket.leave(roomId);

      const roomUsers = usersInRoom.get(roomId);
      if (roomUsers) {
        roomUsers.delete(user.id);
        if (roomUsers.size === 0) {
          usersInRoom.delete(roomId);
        }
      }

      // Emit updated user list to everyone in room
      const allUsers = roomUsers ? Array.from(roomUsers.values()) : [];
      io.to(roomId).emit("room-users", allUsers);

      socket.to(roomId).emit("user-left", user);
      console.log(`👤 ${user.name} (id: ${user.id}) left room ${roomId}`);
    });

    socket.on("disconnect", () => {
      const { roomId, userId, user } = socket;

      if (roomId && userId) {
        const roomUsers = usersInRoom.get(roomId);
        if (roomUsers) {
          roomUsers.delete(userId);
          if (roomUsers.size === 0) {
            usersInRoom.delete(roomId);
          }
        }

        // Emit updated user list to everyone in room
        const allUsers = roomUsers ? Array.from(roomUsers.values()) : [];
        io.to(roomId).emit("room-users", allUsers);

        socket.to(roomId).emit("user-left", user);
        console.log(
          `❌ Client disconnected: ${socket.id} User left room ${roomId}`
        );
      } else {
        console.log("❌ Client disconnected:", socket.id);
      }
    });

    socket.on("send-message", (message) => {
      // Broadcast the message to everyone in the room except sender
      const { roomId } = message;
      console.log(`Message from ${message.sender.name} in room ${roomId}: ${message.text}`);
      socket.to(roomId).emit("receive-message", message);
    });

    socket.on("code-change", ({ roomId, code, userId }) => {
      socket.to(roomId).emit("code-change", { code, userId });
    });
    socket.on("cursor-move", ({ roomId, userId, position }) => {
      socket.to(roomId).emit("cursor-move", { userId, position });
    });
    socket.on("language-change", ({ roomId, language, userId }) => {
      socket.to(roomId).emit("language-change", { language, userId });
    });

    socket.on("document-change", ({ roomId, content, userId }) => {
      socket.to(roomId).emit("document-change", { content, userId });
    });
    

  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
