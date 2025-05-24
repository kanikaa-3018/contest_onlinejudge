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

const RoomCard = ({
  id,
  name,
  description,
  language,
  userCount,
  lastActive,
  createdBy,
}) => {
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
        <Separator/>
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
            <span>Active {lastActive}</span>
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
