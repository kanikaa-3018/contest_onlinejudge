// ChatBox.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import UserAvatar from "./UserAvatar";
import { Send } from "lucide-react";
import socket from "../socket.js";
import { useParams } from "react-router-dom";

const ChatBox = ({ className }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { id: roomId } = useParams();

  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const user = useMemo(() => ({ ...userFromStorage, id: userFromStorage._id }), [userFromStorage]);

  useEffect(() => {
    socket.emit("join-room", { roomId, user });

    const handleMessage = (message) => {
      setMessages((prev) => {
        if (!prev.some((m) => m.id === message.id)) {
          return [...prev, message];
        }
        return prev;
      });
    };

    socket.on("receive-message", handleMessage);

    socket.on("user-joined", (joinedUser) => {
      const systemMessage = {
        id: Date.now().toString() + "-join",
        text: `${joinedUser.name} joined the chat`,
        sender: { id: "system", name: "System" },
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    // socket.on("user-left", (leftUser) => {
    //   const systemMessage = {
    //     id: Date.now().toString() + "-leave",
    //     text: `${leftUser.name} left the chat`,
    //     sender: { id: "system", name: "System" },
    //     timestamp: new Date(),
    //   };
    //   setMessages((prev) => [...prev, systemMessage]);
    // });

    return () => {
      socket.emit("leave-room", { roomId, user });
      socket.off("receive-message", handleMessage);
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [roomId, user.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: {
        id: user.id,
        name: user.name,
        avatar: user.avatar || null,
      },
      timestamp: new Date(),
      roomId,
    };

    setMessages((prev) => [...prev, message]); // Optimistic update
    socket.emit("send-message", message);
    setNewMessage("");
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`flex h-full flex-col rounded-md border ${className}`}
      style={{ borderColor: "#27272a" }}
    >
      <div className="flex items-center border-b px-3 py-2" style={{ borderColor: "#27272a" }}>
        <span className="text-sm font-medium">Chat</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.sender.id === user.id ? "justify-end" : ""
              }`}
            >
              {message.sender.id !== user.id && message.sender.id !== "system" && (
                <UserAvatar name={message.sender.name} image={message.sender.avatar} />
              )}
              <div
                className="max-w-[80%] rounded-lg px-3 py-2 text-sm"
                style={{
                  backgroundColor:
                    message.sender.id === user.id
                      ? "#6A9955"
                      : message.sender.id === "system"
                      ? "#1f2937"
                      : "#27272a",
                  color:
                    message.sender.id === user.id
                      ? "#ffffff"
                      : message.sender.id === "system"
                      ? "#9ca3af"
                      : "#e4e4e7",
                }}
              >
                {message.sender.id !== user.id && message.sender.id !== "system" && (
                  <div className="mb-1 font-medium">{message.sender.name}</div>
                )}
                <div>{message.text}</div>
                <div
                  className="mt-1 text-right text-xs"
                  style={{
                    color:
                      message.sender.id === user.id
                        ? "rgba(255,255,255,0.7)"
                        : "#a1a1aa",
                  }}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form
        onSubmit={handleSendMessage}
        className="flex items-center space-x-2 border-t p-3"
        style={{ borderColor: "#27272a" }}
      >
        <Input
          className="flex-1"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
