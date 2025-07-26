import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Users, Clock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useState, useEffect, useRef } from "react";
import UserAvatar from "./UserAvatar.jsx"; // Use existing UserAvatar component

const formatTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "a few seconds ago";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return new Date(timestamp).toLocaleDateString();
};

// Users Display Component with Avatars
const UsersDisplay = ({ users = [], userCount = 0, isActive }) => {
  const maxVisible = 3;
  const remainingCount = Math.max(0, userCount - maxVisible);
  const visibleUsers = users.slice(0, maxVisible);

  return (
    <div className="flex items-center space-x-3">
      {/* Removed the Users icon */}

      {/* Avatar display */}
      <div className="flex items-center">
        {userCount > 0 ? (
          visibleUsers.length > 0 ? (
            /* Show actual user avatars when we have user data (only when joined) */
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {visibleUsers.map((user, index) => (
                  <div
                    key={user.id || user._id || index}
                    className="relative transform transition-all duration-200 hover:scale-110 hover:z-20 group"
                    style={{ zIndex: maxVisible - index + 5 }}
                  >
                    <UserAvatar
                      name={user.name || "Anonymous"}
                      online={user.online || true}
                      className="w-8 h-8 border-2 border-white dark:border-gray-800 ring-2 ring-gray-300 dark:ring-gray-600 shadow-lg"
                    />

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30">
                      {user.name || "Anonymous"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Remaining count indicator */}
              {remainingCount > 0 && (
                <div
                  className="ml-2 w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white dark:border-gray-800 ring-2 ring-gray-300 dark:ring-gray-600 shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer"
                  title={`+${remainingCount} more users`}
                >
                  +{remainingCount}
                </div>
              )}
            </div>
          ) : (
            /* Show anonymous placeholder avatars when we know count but not users */
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {Array.from({ length: Math.min(userCount, maxVisible) }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 text-white text-xs font-semibold shadow-lg"
                      title="Anonymous user"
                    >
                      <User className="h-4 w-4" />
                    </div>
                  )
                )}
              </div>
              {userCount > maxVisible && (
                <div
                  className="ml-2 w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800 shadow-lg"
                  title={`+${userCount - maxVisible} more anonymous users`}
                >
                  +{userCount - maxVisible}
                </div>
              )}
            </div>
          )
        ) : (
          /* No users at all */
          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 ring-2 ring-gray-300 dark:ring-gray-600 shadow-lg">
            <User className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* User count text */}
      <span
        className={`text-xs font-medium ${
          isActive ? "text-green-400" : "text-muted-foreground"
        }`}
      >
        {userCount} {isActive ? "active" : userCount === 1 ? "user" : "users"}
      </span>
    </div>
  );
};

const RoomCard = ({
  id,
  name,
  description,
  language,
  createdBy,
  socket,
  isActive,
  activeUserCount,
  lastActivity,
  users = [],
}) => {
  // Add debug logging for initial props
  console.log("RoomCard initial props:", {
    id,
    isActive,
    activeUserCount,
    users,
  });

  const [userCount, setUserCount] = useState(activeUserCount || 0);
  const [lastActive, setLastActive] = useState(lastActivity || Date.now());
  const [roomActive, setRoomActive] = useState(isActive || false);
  const [connectedUsers, setConnectedUsers] = useState(users);

  // Use ref for stable active state (prevent flickering)
  const stableActiveRef = useRef(roomActive);
  const activeTimeoutRef = useRef(null);

  // More stable active state management
  const updateActiveState = (newActiveState) => {
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }

    if (newActiveState) {
      setRoomActive(true);
      stableActiveRef.current = true;
    } else {
      setRoomActive(false);
      stableActiveRef.current = false;
    }
  };

  useEffect(() => {
    if (!socket) {
      console.log("No socket provided to RoomCard");
      return;
    }

    // Check if socket is connected
    console.log(`Socket connected: ${socket.connected}`);
    console.log(`Socket id: ${socket.id}`);
    console.log(`Emitting get-room for room ${id}`);

    socket.emit("get-room", id);

    // Add a timeout to see if we get a response
    const responseTimeout = setTimeout(() => {
      console.log(`No response received for room ${id} after 5 seconds`);
    }, 5000);

    const handleRoomMetadata = (data) => {
      clearTimeout(responseTimeout);
      console.log("Room metadata received for room", id, ":", data);
      if (data.error) {
        console.error(data.error);
      } else if (data.roomId === id) {
        const newUserCount = data.userCount || data.activeUserCount || 0;
        console.log("Setting userCount to:", newUserCount);
        setUserCount(newUserCount);
        setLastActive(data.lastActivity || data.lastActive);

        const newActiveState = data.isActive === true || newUserCount > 0;
        updateActiveState(newActiveState);

        if (data.users && Array.isArray(data.users)) {
          console.log("Setting connected users:", data.users);
          setConnectedUsers(data.users);
        } else {
          console.log(
            "No users array in metadata, data keys:",
            Object.keys(data)
          );
          // If no users array, create placeholder data based on count
          if (newUserCount > 0) {
            setConnectedUsers([]); // Empty array, will show placeholder avatars
          }
        }
      }
    };

    const handleRoomActivityUpdate = (data) => {
      console.log("Room activity update received for room", id, ":", data);
      if (data.roomId === id) {
        const newUserCount = data.activeUserCount || 0;
        setUserCount(newUserCount);

        const newActiveState = data.isActive === true || newUserCount > 0;
        updateActiveState(newActiveState);

        if (data.users && Array.isArray(data.users)) {
          setConnectedUsers(data.users);
        }

        if (newActiveState) {
          setLastActive(Date.now());
        }
      }
    };

    const handleUserJoined = (data) => {
      console.log("User joined event for room", id, ":", data);
      if (data.roomId === id) {
        setUserCount((prev) => {
          const newCount = prev + 1;
          console.log(
            `User joined, updating count from ${prev} to ${newCount}`
          );
          return newCount;
        });
        updateActiveState(true);
        setLastActive(Date.now());

        if (data.user) {
          setConnectedUsers((prev) => {
            const newUsers = [...prev, data.user];
            console.log("Adding user to connected users:", newUsers);
            return newUsers;
          });
        }
      }
    };

    const handleUserLeft = (data) => {
      console.log("User left event for room", id, ":", data);
      if (data.roomId === id) {
        setUserCount((prevCount) => {
          const newCount = Math.max(0, prevCount - 1);
          console.log(
            `User left, updating count from ${prevCount} to ${newCount}`
          );
          updateActiveState(newCount > 0);
          if (newCount === 0) {
            setLastActive(Date.now());
          }
          return newCount;
        });

        if (data.userId) {
          setConnectedUsers((prev) => {
            const filteredUsers = prev.filter(
              (user) => user.id !== data.userId && user._id !== data.userId
            );
            console.log("Removing user from connected users:", filteredUsers);
            return filteredUsers;
          });
        }
      }
    };

    // Also listen for generic socket events to debug connection
    const handleConnect = () => {
      console.log("Socket connected");
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    const handleError = (error) => {
      console.error("Socket error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("error", handleError);
    socket.on("room-metadata", handleRoomMetadata);
    socket.on("room-activity-update", handleRoomActivityUpdate);
    socket.on("user-joined-room", handleUserJoined);
    socket.on("user-left-room", handleUserLeft);

    return () => {
      clearTimeout(responseTimeout);
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("error", handleError);
      socket.off("room-metadata", handleRoomMetadata);
      socket.off("room-activity-update", handleRoomActivityUpdate);
      socket.off("user-joined-room", handleUserJoined);
      socket.off("user-left-room", handleUserLeft);

      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
        activeTimeoutRef.current = null;
      }
    };
  }, [socket, id]); // Removed userCount from dependencies to prevent unnecessary re-runs

  // Debug log current state
  console.log(`RoomCard ${id} current state:`, {
    userCount,
    connectedUsers,
    roomActive,
  });

  return (
    <Card
      className={`overflow-hidden border transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        roomActive ? "ring-2 ring-green-500 border-green-500" : ""
      }`}
      style={{
        backgroundColor: "rgba(15, 15, 35, 0.6)",
        backdropFilter: "blur(8px)",
        borderColor: roomActive ? "#22c55e" : "rgba(39, 39, 42, 0.6)",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-foreground">
              {name}
            </CardTitle>
            {roomActive && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">LIVE</span>
              </div>
            )}
          </div>

          <Badge
            variant="outline"
            className={`text-xs font-medium ${getLanguageColor(language)}`}
          >
            {language}
          </Badge>
        </div>
        <Separator />
        <p className="text-xs text-muted-foreground mt-1 italic">
          Created by{" : "}
          <span className="font-medium text-foreground">{createdBy}</span>
        </p>
        <CardDescription className="line-clamp-2 mt-1 text-sm">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center justify-between text-xs">
          <UsersDisplay
            users={connectedUsers}
            userCount={userCount}
            isActive={roomActive}
          />

          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>
              {roomActive
                ? "Active now"
                : lastActive
                ? `${formatTimeAgo(lastActive)}`
                : "Loading..."}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          asChild
          variant={roomActive ? "default" : "outline"}
          className={`w-full transition-all duration-200 ${
            roomActive ? "room-button-active" : "room-button-inactive"
          }`}
        >
          <Link to={`/room/${id}`}>
            {roomActive ? "Join Live Room" : "Join Room"}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper function for language-based color coding
const getLanguageColor = (language) => {
  const colors = {
    javascript: "bg-yellow-500 text-black border-yellow-400",
    python: "bg-blue-500 text-white border-blue-400",
    java: "bg-orange-500 text-white border-orange-400",
    cpp: "bg-purple-500 text-white border-purple-400",
    c: "bg-gray-500 text-white border-gray-400",
  };
  return (
    colors[language?.toLowerCase()] || "bg-gray-500 text-white border-gray-400"
  );
};

export default RoomCard;
