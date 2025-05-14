import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

const NavItem = ({ icon, label, href, isCollapsed, isActive }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 transition-colors",
        isActive
          ? "bg-[#B6BBC4] text-[#161A30]"
          : "hover:bg-[#B6BBC4]/20 text-[#B6BBC4] hover:text-[#F0ECE5]"
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center">
        {icon}
      </div>
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
};

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col h-screen transition-all duration-300 ease-in-out border-r",
        isCollapsed ? "w-16" : "w-64",
        "bg-[#161A30] border-[#31304D]"
      )}
    >
      <a href="/" className="flex h-14 items-center px-4 border-b border-[#31304D]">
        <h2 className="font-bold text-xl text-[#F0ECE5]">
          {isCollapsed ? "CA" : "CodeArena"}
        </h2>
      </a>

      <div className="flex flex-col gap-1 p-2 flex-1">
        <NavItem
          icon={<Calendar className="h-4 w-4 text-[#B6BBC4]" />}
          label="Contests"
          href="/contests"
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Code className="h-4 w-4 text-[#B6BBC4]" />}
          label="Practice"
          href="/practice"
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Terminal className="h-4 w-4 text-[#B6BBC4]" />}
          label="Code Editor"
          href="/questions"
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Award className="h-4 w-4 text-[#B6BBC4]" />}
          label="Leaderboard"
          href="/leaderboard"
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Bot className="h-4 w-4 text-[#B6BBC4]" />}
          label="AI Assistant"
          href="/ai-assistant"
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<User className="h-4 w-4 text-[#B6BBC4]" />}
          label="Profile"
          href="/profile"
          isCollapsed={isCollapsed}
        />
        <NavItem
          icon={<Brain className="h-4 w-4 text-[#B6BBC4]" />}
          label="Learn"
          href="/learn"
          isCollapsed={isCollapsed}
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="m-2 self-end"
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          color: "#B6BBC4",
          backgroundColor: "#161A30",
        }}
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
