import { useState } from "react";
import RoomCard from "../components/RoomCard";
import CreateRoomDialog from "../components/CreateRoomDialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Search, Code } from "lucide-react";

// Mock rooms data
const mockRooms = [
  {
    id: "1",
    name: "Frontend Team",
    description: "Working on the new UI components for the dashboard.",
    language: "TypeScript",
    userCount: 4,
    lastActive: "2 mins ago",
  },
  {
    id: "2",
    name: "API Integration",
    description: "Connecting our app to the payment gateway API.",
    language: "JavaScript",
    userCount: 2,
    lastActive: "5 mins ago",
  },
  {
    id: "3",
    name: "Database Structure",
    description: "Planning the MongoDB collections and relationships.",
    language: "MongoDB",
    userCount: 3,
    lastActive: "10 mins ago",
  },
  {
    id: "4",
    name: "Authentication System",
    description: "Implementing JWT authentication and authorization.",
    language: "Node.js",
    userCount: 2,
    lastActive: "15 mins ago",
  },
  {
    id: "5",
    name: "Mobile App Features",
    description: "Developing new features for the React Native app.",
    language: "React Native",
    userCount: 3,
    lastActive: "20 mins ago",
  },
  {
    id: "6",
    name: "Backend Optimization",
    description: "Performance tuning for API endpoints.",
    language: "Express",
    userCount: 2,
    lastActive: "30 mins ago",
  },
];

const RoomDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  // Filter rooms based on search query and tab filter
  const filteredRooms = mockRooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "active") return matchesSearch && room.userCount > 0;
    
    return matchesSearch;
  });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Code Together</h1>
          <p style={{ color: '#a1a1aa' }}>
            Join a room or create a new one to start collaborating.
          </p>
        </div>
        <CreateRoomDialog />
      </div>

      <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4" style={{ color: '#a1a1aa' }} />
          <Input
            placeholder="Search rooms..."
            className="pl-9"
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
          className="md:w-auto"
        >
          Reset Filters
        </Button>
      </div>

      <Tabs defaultValue="all" value={filter} onValueChange={setFilter}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Rooms</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="my">My Rooms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} {...room} />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: '#27272a' }}>
                <Code className="h-10 w-10" style={{ color: '#a1a1aa' }} />
              </div>
              <h3 className="mt-4 text-lg font-medium">No rooms found</h3>
              <p className="mb-4 mt-2 text-sm" style={{ color: '#a1a1aa' }}>
                We couldn't find any rooms matching your search.
              </p>
              <Button onClick={() => setSearchQuery("")}>Clear search</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.map((room) => (
              <RoomCard key={room.id} {...room} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="my" className="mt-0">
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: '#27272a' }}>
              <Code className="h-10 w-10" style={{ color: '#a1a1aa' }} />
            </div>
            <h3 className="mt-4 text-lg font-medium">No rooms created yet</h3>
            <p className="mb-4 mt-2 text-sm" style={{ color: '#a1a1aa' }}>
              Create your first room to start collaborating with others.
            </p>
            <CreateRoomDialog />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RoomDashboard;
