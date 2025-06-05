import { io } from "socket.io-client";

const URL = `${import.meta.env.VITE_BACKEND_URL}`;
const socket = io(URL, {
  transports: ["websocket"],
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err);
});

export default socket;
