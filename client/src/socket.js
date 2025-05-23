import { io } from "socket.io-client";

const URL = "http://localhost:8080";
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
