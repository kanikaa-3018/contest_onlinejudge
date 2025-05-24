import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/ui/resizable";
import CodeEditor from "../components/CodeEditor.jsx";
import DocumentEditor from "../components/DocumentEditor.jsx";
import ChatBox from "./ChatBox.jsx";
import UsersSidebar from "./UsersSidebar.jsx";
import { useIsMobile } from "../hooks/use-mobile";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import socket from "../socket.js";

const RoomPage = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("code");
  const [docContent, setDocContent] = useState();

  const handleContentChange = (updatedContent) => {
    setDocContent(updatedContent);
    // You can also do something else here, like auto-saving, etc.
    console.log("Document content updated:", updatedContent);
  };

  const roomName = "Room #" + id;
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
    const user = { ...userFromStorage, id: userFromStorage._id };

  useEffect(() => {
    socket.emit("test", { message: "Hello from client" });

    socket.on("test-reply", (data) => {
      console.log("💬 Reply from server:", data);
    });

    return () => {
      socket.off("test-reply");
    };
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ backgroundColor: "#0f0f23" }}>
      <div className="flex h-14 items-center justify-between border-b px-4" style={{ borderColor: "#27272a" }}>
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-medium">{roomName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Invite</Button>
          <Button variant="secondary" size="sm">Settings</Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {isMobile ? (
          <div className="flex w-full flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b px-4" style={{ borderColor: "#27272a" }}>
                <TabsList>
                  <TabsTrigger value="code">Code</TabsTrigger>
                  <TabsTrigger value="docs">Docs</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden p-4">
                <TabsContent value="code" className="h-full mt-0 border-none p-0">
                  <CodeEditor />
                </TabsContent>
                <TabsContent value="docs" className="h-full mt-0 border-none p-0">
                  <DocumentEditor />
                </TabsContent>
                <TabsContent value="chat" className="h-full mt-0 border-none p-0">
                  <ChatBox />
                </TabsContent>
                <TabsContent value="users" className="h-full mt-0 border-none p-0">
                  <UsersSidebar />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        ) : (
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
              <UsersSidebar />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
