import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Calendar,
  Code,
  Award,
  User,
  Trophy,
  Terminal,
  Bot,
  Brain,
  ChevronLeft,
  ChevronRight,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const NavItem = ({ icon, label, href, isCollapsed, closeSidebar }) => (
  <Link
    to={href}
    onClick={() => {
      if (closeSidebar) closeSidebar(); // Close sidebar on mobile when a nav item is clicked
    }}
    className={cn(
      "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
      "hover:bg-[#B6BBC4]/20 text-[#B6BBC4] hover:text-[#F0ECE5]"
    )}
  >
    <div className="flex h-5 w-5 items-center justify-center">{icon}</div>
    {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
  </Link>
);

export const Sidebar = ({ isMobileOpen = false, closeSidebar = () => {} }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "fixed sm:static z-40 h-screen overflow-y-auto transition-all duration-300 ease-in-out border-r bg-[#161A30] border-[#31304D]",
        isCollapsed ? "w-16" : "w-64",
        isMobileOpen ? "left-0" : "left-[-100%] sm:left-0"
      )}
    >
      {/* Close button (mobile only) */}
      <div className="sm:hidden flex justify-end p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={closeSidebar}
          className="text-white"
        >
          <X />
        </Button>
      </div>

      {/* Brand */}
      <a href="/" className="flex h-14 items-center px-4 border-b border-[#31304D]">
        <h2 className="font-bold text-xl text-[#F0ECE5]">
          {isCollapsed ? "CA" : "CodeArena"}
        </h2>
      </a>

      {/* Navigation */}
      <div className="flex flex-col gap-1 p-2 flex-1">
        <NavItem
          icon={<Calendar className="h-4 w-4 text-[#B6BBC4]" />}
          label="Contests"
          href="/contests"
          isCollapsed={isCollapsed}
          closeSidebar={closeSidebar}
        />
        <NavItem
          icon={<Code className="h-4 w-4 text-[#B6BBC4]" />}
          label="Practice"
          href="/practice"
          isCollapsed={isCollapsed}
          closeSidebar={closeSidebar}
        />
        <NavItem
          icon={<Terminal className="h-4 w-4 text-[#B6BBC4]" />}
          label="Code Editor"
          href="/questions"
          isCollapsed={isCollapsed}
          closeSidebar={closeSidebar}
        />
        <NavItem
          icon={<Award className="h-4 w-4 text-[#B6BBC4]" />}
          label="Leaderboard"
          href="/leaderboard"
          isCollapsed={isCollapsed}
          closeSidebar={closeSidebar}
        />
        <NavItem
          icon={<Bot className="h-4 w-4 text-[#B6BBC4]" />}
          label="Internship Tracker"
          href="/intern"
          isCollapsed={isCollapsed}
          closeSidebar={closeSidebar}
        />
        <NavItem
          icon={<User className="h-4 w-4 text-[#B6BBC4]" />}
          label="Profile"
          href="/profile"
          isCollapsed={isCollapsed}
          closeSidebar={closeSidebar}
        />
        <NavItem
          icon={<Brain className="h-4 w-4 text-[#B6BBC4]" />}
          label="Learn"
          href="/learn"
          isCollapsed={isCollapsed}
          closeSidebar={closeSidebar}
        />
        <NavItem
          icon={<Users className="h-4 w-4 text-[#B6BBC4]" />}
          label="Peer Rooms"
          href="/room"
          isCollapsed={isCollapsed}
          closeSidebar={closeSidebar}
        />
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="m-2 self-end hidden sm:block"
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{ color: "#B6BBC4", backgroundColor: "#161A30" }}
      >
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default Sidebar;
