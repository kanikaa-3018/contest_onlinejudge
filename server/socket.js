const { Server } = require("socket.io");

let io;

const usersInRoom = new Map();
const roomMessages = {};
const rooms = {};

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

      if (!rooms[roomId]) {
        rooms[roomId] = {
          code: "",
          language: "javascript",
          input: "",
          output: "",
          documentContent: "",
          lastActive: Date.now(),
        };
      }
      socket.emit("load-state", {
        documentContent: rooms[roomId].documentContent,
        code: rooms[roomId].code,
        language: rooms[roomId].language,
        input: rooms[roomId].input,
        output: rooms[roomId].output,
      });

      const history = roomMessages[roomId] || [];
      socket.emit("chat-history", history);

      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = user.id;
      socket.user = user;

      if (!usersInRoom.has(roomId)) {
        usersInRoom.set(roomId, new Map());
      }

      const roomUsers = usersInRoom.get(roomId);

      if (roomUsers.has(user.id)) {
        socket.emit("error", "User already connected in this room.");
        return;
      }

      roomUsers.set(user.id, { ...user, online: true });

      const allUsers = Array.from(roomUsers.values());
      io.to(roomId).emit("room-users", allUsers);
      socket.to(roomId).emit("room-users", allUsers);

      io.to(roomId).emit("room-metadata", {
        userCount: allUsers.length,
        lastActive: rooms[roomId].lastActive,
        isActive: true,
        activeUserCount: allUsers.length,
      });

      // Broadcast to all clients that room activity has changed
      socket.broadcast.emit("room-activity-update", {
        roomId,
        isActive: true,
        activeUserCount: allUsers.length,
      });
    });

    socket.on("leave-room", ({ roomId, user }) => {
      if (!roomId || !user || !user.id) return;

      socket.leave(roomId);

      const roomUsers = usersInRoom.get(roomId);
      if (roomUsers) {
        roomUsers.delete(user.id);

        if (roomUsers.size === 0) {
          usersInRoom.delete(roomId);
          delete rooms[roomId];
          delete roomMessages[roomId];
          // console.log(`🔥 Room ${roomId} fully cleared (via leave-room)`);
        }
      }

      const allUsers = roomUsers ? Array.from(roomUsers.values()) : [];
      io.to(roomId).emit("room-users", allUsers);
      socket.to(roomId).emit("user-left", user);
      delete socket.roomId;
      delete socket.userId;

      io.to(roomId).emit("room-metadata", {
        userCount: roomUsers?.size || 0,
        lastActive: rooms[roomId]?.lastActive || Date.now(),
      });
    });

    socket.on("disconnect", () => {
      const { roomId, userId, user } = socket;
      console.log("🔌 DISCONNECT triggered", { roomId, userId });

      if (roomId && userId) {
        const roomUsers = usersInRoom.get(roomId);
        if (roomUsers) {
          roomUsers.delete(userId);

          if (roomUsers.size === 0) {
            usersInRoom.delete(roomId);
            delete rooms[roomId];
            delete roomMessages[roomId];
            console.log(`🔥 Room ${roomId} fully cleared`);
          }
        }

        const allUsers = roomUsers ? Array.from(roomUsers.values()) : [];
        io.to(roomId).emit("room-users", allUsers);
        socket.to(roomId).emit("user-left", user);

        io.to(roomId).emit("room-metadata", {
          userCount: roomUsers?.size || 0,
          lastActive: rooms[roomId]?.lastActive || Date.now(),
        });
      } else {
        console.log("❌ Client disconnected without room context:", socket.id);
      }

      const roomUsers = usersInRoom.get(socket.roomId);
      if (roomUsers) {
        // After user leaves, check if room is still active
        const remainingUsers = Array.from(roomUsers.values());
        const isStillActive = remainingUsers.length > 0;

        socket.broadcast.emit("room-activity-update", {
          roomId: socket.roomId,
          isActive: isStillActive,
          activeUserCount: remainingUsers.length,
        });
      }
    });

    socket.on("send-message", (message) => {
      const { roomId } = message;
      if (!roomMessages[roomId]) roomMessages[roomId] = [];
      roomMessages[roomId].push(message);
      // console.log(`Message from ${message.sender.name} in room ${roomId}: ${message.text}`);
      socket.to(roomId).emit("receive-message", message);
    });

    socket.on("code-change", ({ roomId, code, userId }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = {
          documentContent: "",
          code: "",
          language: "javascript",
          input: "",
          output: "",
          lastActive: Date.now(),
        };
      }
      rooms[roomId].code = code;
      rooms[roomId].lastActive = Date.now();
      socket.to(roomId).emit("code-change", { code, userId });

      const roomUsers = usersInRoom.get(roomId);

      io.to(roomId).emit("room-metadata", {
        userCount: roomUsers?.size || 0,
        lastActive: rooms[roomId].lastActive,
      });
    });
    socket.on("cursor-move", ({ roomId, userId, position }) => {
      socket.to(roomId).emit("cursor-move", { userId, position });
    });
    socket.on("language-change", ({ roomId, language, userId }) => {
      if (!rooms[roomId]) rooms[roomId] = {};
      rooms[roomId].language = language;
      socket.to(roomId).emit("language-change", { language, userId });

      const roomUsers = usersInRoom.get(roomId);

      io.to(roomId).emit("room-metadata", {
        userCount: roomUsers?.size || 0,
        lastActive: rooms[roomId].lastActive,
      });
    });

    socket.on("document-change", ({ roomId, content, userId }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = {
          documentContent: "",
          code: "",
          language: "javascript",
          input: "",
          output: "",
          lastActive: Date.now(),
        };
      }
      rooms[roomId].documentContent = content;
      rooms[roomId].lastActive = Date.now();
      socket.to(roomId).emit("document-change", { content, userId });

      const roomUsers = usersInRoom.get(roomId);

      io.to(roomId).emit("room-metadata", {
        userCount: roomUsers?.size || 0,
        lastActive: rooms[roomId].lastActive,
      });
    });

    socket.on("input-change", ({ roomId, input, userId }) => {
      if (!rooms[roomId]) rooms[roomId] = {};
      rooms[roomId].input = input;
      socket.to(roomId).emit("input-change", { input, userId });

      const roomUsers = usersInRoom.get(roomId);

      io.to(roomId).emit("room-metadata", {
        userCount: roomUsers?.size || 0,
        lastActive: rooms[roomId].lastActive,
      });
    });

    socket.on("output-change", ({ roomId, output, userId }) => {
      if (!rooms[roomId]) rooms[roomId] = {};
      rooms[roomId].output = output;
      socket.to(roomId).emit("output-change", { output, userId });

      const roomUsers = usersInRoom.get(roomId);

      io.to(roomId).emit("room-metadata", {
        userCount: roomUsers?.size || 0,
        lastActive: rooms[roomId].lastActive,
      });
    });

    socket.on("get-room", (roomId) => {
      if (!roomId || !rooms[roomId]) {
        socket.emit("room-metadata", { error: "Room not found." });
        return;
      }

      const roomData = rooms[roomId];
      const roomUsers = usersInRoom.get(roomId);
      const userCount = roomUsers?.size || 0;

      socket.emit("room-metadata", {
        roomId,
        ...roomData,
        userCount,
      });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
