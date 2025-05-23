import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import UserAvatar from "./UserAvatar.jsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import socket from "../socket.js";
import { useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";

const UsersSidebar = ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const { id: roomId } = useParams();

  useEffect(() => {
    const userFromStorage = JSON.parse(localStorage.getItem("user"));
    const user = { ...userFromStorage, id: userFromStorage._id };

    socket.emit("join-room", { roomId, user: user });

    socket.on("room-users", (roomUsers) => {
      setUsers(roomUsers);
    });

    socket.on("user-joined", (newUser) => {
      setUsers((prev) => {
        if (prev.some((u) => u.id === newUser.id)) return prev;
        return [...prev, newUser];
      });
    });

    socket.on("user-left", (leftUser) => {
      setUsers((prev) => prev.filter((u) => u.id !== leftUser.id));
    });

    return () => {
      socket.off("room-users");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [roomId]);

  return (
    <div
      className={`relative flex h-full flex-col border-l p-2 transition-all duration-300 ${
        collapsed ? "w-22" : "w-64"
      } ${className}`}
      style={{
        borderColor: "#27272a",
        backgroundColor: "#0f0f23",
      }}
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute top-4 left-8 z-10 h-6 w-6 rounded-full transition-transform duration-300"
        style={{
          transform: collapsed ? "translateX(-50%)" : "translateX(-100%)",
          backgroundColor: "#27272a",
        }}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ArrowRight className="h-3 w-6" />
        ) : (
          <ArrowLeft className="h-3 w-6" />
        )}
      </Button>

      <div className="flex items-center py-2">
        {!collapsed ? <h3 className="text-sm font-medium ml-8">Connected Users</h3> : <FaUser className="ml-10 mt-1"/>}
      </div>
      <Separator className="my-2" />

      <ScrollArea className="flex-1">
        <div className="space-y-3 pr-3">
          {users.map((u) => (
            <div
              key={u._id}
              className={`flex items-center rounded-md p-2 ${
                u.id === user.id ? "" : "hover:bg-opacity-50"
              }`}
              style={{
                backgroundColor: u.id === user.id ? "#3f3f46" : "transparent",
              }}
            >
              <UserAvatar name={u.name} online={u.online} />
              {!collapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {u._id === user._id ? "You" : u.name}
                  </p>
                  <p className="text-xs" style={{ color: "#a1a1aa" }}>
                    {u.online ? "Online" : "Offline"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UsersSidebar;
