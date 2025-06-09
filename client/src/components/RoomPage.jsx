import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent } from "../components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import CodeEditor from "../components/CodeEditor.jsx";
import DocumentEditor from "../components/DocumentEditor.jsx";
import ChatBox from "./ChatBox.jsx";
import UsersSidebar from "./UsersSidebar.jsx";
import { useIsMobile } from "../hooks/use-mobile";
import socket from "../socket.js";
import { ArrowLeft, Code, FileText, MessageCircle, Users, Phone, Settings } from "lucide-react";

const RoomPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("code");
  const [docContent, setDocContent] = useState();
  const [users, setUsers] = useState([]);

  
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const user = userFromStorage ? { ...userFromStorage, id: userFromStorage._id } : null;

  // useEffect(() => {
  //   if (!user) {
     
  //     navigate("/auth");
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    if (!user) return; // don't join socket room if no user

    socket.emit("join-room", { roomId: id, user });

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

    socket.on("test-reply", (data) => {
      console.log("💬 Reply from server:", data);
    });

    socket.emit("test", { message: "Hello from client" });

    return () => {
      socket.off("room-users");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("test-reply");
    };
  }, [id, user]);

  const handleContentChange = (updatedContent) => {
    setDocContent(updatedContent);
    console.log("Document content updated:", updatedContent);
  };

  const mobileTabs = [
    { value: "code", label: "Code", icon: <Code size={20} /> },
    { value: "docs", label: "Docs", icon: <FileText size={20} /> },
    { value: "chat", label: "Chat", icon: <MessageCircle size={20} /> },
  ];

  const OnlineUsersBar = () => (
    <div
      className="flex items-center gap-2 overflow-x-auto px-3 py-1 bg-[#27272a] border-b border-[#3a3a3a]"
      style={{ minHeight: 40 }}
    >
      <Users className="inline-block text-gray-400" size={18} />
      <div className="flex gap-2">
        {users.length === 0 && (
          <span className="text-gray-400 text-xs">No users online</span>
        )}
        {users.map((u) => (
          <div
            key={u.id}
            title={u.name || "Anonymous"}
            aria-label={u.name || "Anonymous"}
            className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-white select-none ${
              u.online ? "bg-green-500" : "bg-gray-500"
            }`}
          >
            {(u.name && u.name[0].toUpperCase()) || "?"}
          </div>
        ))}
      </div>
    </div>
  );

  if (!user) {
   
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f23] text-white">
        <div className="text-center animate-pulse">
          <h1 className="text-3xl font-bold mb-2">Redirecting to login...</h1>
          <p className="text-gray-400 text-sm">
            If not redirected, click{" "}
            <Link to="/auth" className="text-blue-400 underline">
              here
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  const roomName = "Room #" + id;

  return (
    <div
      className="flex h-screen flex-col overflow-hidden"
      style={{ backgroundColor: "#0f0f23" }}
    >
      <div
        className="flex h-14 items-center justify-between border-b px-4"
        style={{ borderColor: "#27272a" }}
      >
        {/* Left: Back button + room name */}
        <div className="flex items-center gap-3">
          <Link to="/room">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-medium text-white truncate max-w-xs sm:max-w-none">
            {roomName}
          </h1>
        </div>

        {/* Right: Buttons & icons */}
        <div className="flex items-center gap-2">
          {/* Desktop buttons */}
          <Button
            className="bg-red-700 text-white hover:bg-red-800 hidden sm:inline-flex"
            size="sm"
            onClick={() => navigate("/room")}
          >
            Leave Room
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex text-white border-gray-600 hover:border-gray-500"
          >
            Invite
          </Button>

          <Button
            variant="secondary"
            size="sm"
            className="hidden sm:inline-flex text-white"
          >
            Settings
          </Button>

          {/* Mobile icons */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden text-white"
            aria-label="Call"
            onClick={() => {
              alert("Call feature clicked!");
            }}
          >
            <Phone className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden text-white"
            aria-label="Settings"
            onClick={() => {
              alert("Settings clicked!");
            }}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
          <div className="flex flex-col h-full w-full">
            {/* Top tabs with icons */}
            <div
              className="flex border-b border-[#3a3a3a] bg-[#27272a]"
              style={{ minHeight: 48 }}
            >
              {mobileTabs.map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`flex flex-col items-center justify-center text-xs select-none px-4 transition-colors duration-200 whitespace-nowrap ${
                    activeTab === value
                      ? "text-white border-b-2 border-blue-500"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                  style={{ flex: 1 }}
                  aria-label={label}
                  type="button"
                >
                  {icon}
                  <span className="mt-1">{label}</span>
                </button>
              ))}
            </div>

            {/* Online users bar always visible */}
            <OnlineUsersBar />

            {/* Tab contents */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 h-full overflow-hidden"
            >
              <TabsContent value="code" className="h-full p-0">
                <div className="h-full p-2 overflow-auto bg-[#1e1e3f] rounded-md">
                  <CodeEditor roomId={id} userId={user.id} />
                </div>
              </TabsContent>
              <TabsContent value="docs" className="h-full p-0">
                <div className="h-full p-2 overflow-auto bg-[#1e1e3f] rounded-md">
                  <DocumentEditor onContentChange={handleContentChange} />
                </div>
              </TabsContent>
              <TabsContent value="chat" className="h-full p-0">
                <div className="h-full p-2 overflow-auto bg-[#1e1e3f] rounded-md flex flex-col">
                  <ChatBox />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          // Desktop layout unchanged, pass users to sidebar
          <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
            <ResizablePanel defaultSize={50} minSize={30}>
              <CodeEditor roomId={id} userId={user.id} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25}>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel defaultSize={60}>
                  <DocumentEditor onContentChange={handleContentChange} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={40}>
                  <ChatBox />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
              <UsersSidebar users={users} />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
