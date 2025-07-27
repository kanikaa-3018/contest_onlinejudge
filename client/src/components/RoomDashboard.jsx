import { useState, useEffect, use } from "react";
import RoomCard from "../components/RoomCard";
import CreateRoomDialog from "../components/CreateRoomDialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Search, Code } from "lucide-react";
import socket from "../socket";

const RoomDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/rooms`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch rooms");
        }
        const data = await response.json();
        console.log(data);
        setRooms(data);
        console.log("rooms", rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();

    // Listen for real-time room activity updates
    socket.on("room-activity-update", (activityData) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room._id === activityData.roomId
            ? {
                ...room,
                isActive: activityData.isActive,
                activeUserCount: activityData.activeUserCount,
              }
            : room
        )
      );
    });

    return () => {
      socket.off("room-activity-update");
    };
  }, []);

  useEffect(() => {
    console.log("Updated rooms state:", rooms);
  }, [rooms]);

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "all") return matchesSearch;
    if (filter === "active")
      return matchesSearch && room.isActive && room.activeUserCount > 0;
    if (filter === "my")
      return matchesSearch && room.createdBy?._id === user?._id;

    return matchesSearch;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Code Together</h1>
          <p style={{ color: "#a1a1aa" }}>
            Join a room or create a new one to start collaborating.
          </p>
        </div>
        <CreateRoomDialog />
      </div>

      <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-2.5 top-2.5 h-4 w-4"
            style={{ color: "#a1a1aa" }}
          />
          <Input
            placeholder="Search rooms..."
            className="pl-9 border border-[#a1a1aa]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery("");
            setFilter("all");
          }}
          className="md:w-auto border border-[#a1a1aa]"
          style={{ borderColor: "#a1a1aa" }}
        >
          Reset Filters
        </Button>
      </div>

      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <TabsList className="mb-6 tabs-list-with-bg">
          <TabsTrigger
            value="all"
            className="tabs-trigger-with-bg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:border-b-2 data-[state=active]:border-gray-300"
          >
            All Rooms
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="tabs-trigger-with-bg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Active
          </TabsTrigger>
          <TabsTrigger
            value="my"
            className="tabs-trigger-with-bg data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            My Rooms
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {loading ? (
            <p>Loading rooms...</p>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  id={room._id}
                  name={room.name}
                  description={room.description}
                  language={room.language}
                  socket={socket}
                  createdBy={room.createdBy?.name || "Unknown"}
                  isActive={room.isActive}
                  activeUserCount={room.activeUserCount}
                  lastActivity={room.lastActivity}
                  users={room.connectedUsers || []} // Pass connected users data
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: "#27272a" }}
              >
                <Code className="h-10 w-10" style={{ color: "#a1a1aa" }} />
              </div>
              <h3 className="mt-4 text-lg font-medium">No rooms found</h3>
              <p className="mb-4 mt-2 text-sm" style={{ color: "#a1a1aa" }}>
                We couldn't find any rooms matching your search.
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear search</Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-0">
          {loading ? (
            <p>Loading rooms...</p>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  id={room._id}
                  name={room.name}
                  description={room.description}
                  language={room.language}
                  socket={socket}
                  createdBy={room.createdBy?.name || "Unknown"}
                  isActive={room.isActive}
                  activeUserCount={room.activeUserCount}
                  lastActivity={room.lastActivity}
                  users={room.connectedUsers || []} // Pass connected users data
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: "#27272a" }}
              >
                <Code className="h-10 w-10" style={{ color: "#a1a1aa" }} />
              </div>
              <h3 className="mt-4 text-lg font-medium">No active rooms</h3>
              <p className="mb-4 mt-2 text-sm" style={{ color: "#a1a1aa" }}>
                There are currently no active rooms.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my" className="mt-0">
          {loading ? (
            <p>Loading rooms...</p>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  id={room._id}
                  name={room.name}
                  description={room.description}
                  language={room.language}
                  socket={socket}
                  createdBy={room.createdBy?.name || "Unknown"}
                  isActive={room.isActive}
                  activeUserCount={room.activeUserCount}
                  lastActivity={room.lastActivity}
                  users={room.connectedUsers || []} // Pass connected users data
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: "#27272a" }}
              >
                <Code className="h-10 w-10" style={{ color: "#a1a1aa" }} />
              </div>
              <h3 className="mt-4 text-lg font-medium">No rooms created yet</h3>
              <p className="mb-4 mt-2 text-sm" style={{ color: "#a1a1aa" }}>
                Create your first room to start collaborating with others.
              </p>
              <CreateRoomDialog />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomDashboard;
