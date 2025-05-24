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
import { Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { useState, useEffect } from "react";

const formatTimeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "a few seconds ago";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return new Date(timestamp).toLocaleDateString();
};

const RoomCard = ({ id, name, description, language, createdBy, socket }) => {
  const [userCount, setUserCount] = useState(0);
  const [lastActive, setLastActive] = useState("Inactive");

  useEffect(() => {
    if (!socket) return;
  
    socket.emit("get-room", id);
  
    const handleRoomMetadata = (data) => {
      if (data.error) {
        console.error(data.error);
      } else if (data.roomId === id) {
        setUserCount(data.userCount);
        setLastActive(data.lastActive);
      }
    };
  
    socket.on("room-metadata", handleRoomMetadata);
  
    return () => {
      socket.off("room-metadata", handleRoomMetadata);
    };
  }, [socket, id]);
  

  return (
    <Card
      className="overflow-hidden border transition-all hover:shadow-md"
      style={{
        borderColor: "#27272a",
        backgroundColor: "rgba(15, 15, 35, 0.6)",
        backdropFilter: "blur(8px)",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold">{name}</CardTitle>

          <Badge
            variant="outline"
            className="text-xs font-medium"
            style={{ backgroundColor: "#27272a" }}
          >
            {language}
          </Badge>
        </div>
        <Separator />
        <p className="text-xs text-gray-400 mt-1 italic">
          Created by{" : "}
          <span className="font-medium text-white">{createdBy}</span>
        </p>
        <CardDescription
          className="line-clamp-2 mt-1 text-sm"
          style={{ color: "#a1a1aa" }}
        >
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div
          className="flex items-center space-x-4 text-xs"
          style={{ color: "#a1a1aa" }}
        >
          <div className="flex items-center">
            <Users className="mr-1 h-3 w-3" />
            <span>{userCount} users</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>
              {lastActive
                ? `Active ${formatTimeAgo(lastActive)}`
                : "Loading..."}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="default" className="w-full">
          <Link to={`/room/${id}`}>Join Room</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
