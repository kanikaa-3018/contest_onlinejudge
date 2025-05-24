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

      const allUsers = roomUsers ? Array.from(roomUsers.values()) : [];
      io.to(roomId).emit("room-users", allUsers);

      socket.to(roomId).emit("user-left", user);
      // console.log(`👤 ${user.name} (id: ${user.id}) left room ${roomId}`);
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
        };
      }
      rooms[roomId].code = code;

      socket.to(roomId).emit("code-change", { code, userId });
    });
    socket.on("cursor-move", ({ roomId, userId, position }) => {
      socket.to(roomId).emit("cursor-move", { userId, position });
    });
    socket.on("language-change", ({ roomId, language, userId }) => {
      if (!rooms[roomId]) rooms[roomId] = {};
      rooms[roomId].language = language;
      socket.to(roomId).emit("language-change", { language, userId });
    });

    socket.on("document-change", ({ roomId, content, userId }) => {
      if (!rooms[roomId]) {
        rooms[roomId] = {
          documentContent: "",
          code: "",
          language: "javascript",
          input: "",
          output: "",
        };
      }
      rooms[roomId].documentContent = content;
      socket.to(roomId).emit("document-change", { content, userId });
    });

    socket.on("input-change", ({ roomId, input, userId }) => {
      if (!rooms[roomId]) rooms[roomId] = {};
  rooms[roomId].input = input;
      socket.to(roomId).emit("input-change", { input, userId });
    });

    socket.on("output-change", ({ roomId, output, userId }) => {
      if (!rooms[roomId]) rooms[roomId] = {};
  rooms[roomId].output = output;
      socket.to(roomId).emit("output-change", { output, userId });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};

module.exports = { initSocket, getIO };
