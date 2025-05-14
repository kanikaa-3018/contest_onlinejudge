import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [usernameInitials, setUsernameInitials] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        const username = parsed.username || parsed.name || ""; 
        if (username) {
          const initials = username
            .split(" ")
            .map((word) => word[0]?.toUpperCase()) 
            .join("")
            .slice(0, 2);
          setUsernameInitials(initials || "US");
          setIsLoggedIn(true); 
        }
      } catch {
        console.warn("Failed to parse user from localStorage.");
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsernameInitials(null);
  };

  return (
    <header
      className="flex h-14 items-center gap-4 px-4 lg:px-6 border-b"
      style={{
        backgroundColor: "#161A30",
        borderColor: "#31304D",
      }}
    >
      <div className="flex-1 flex items-center gap-2">
        <div className="relative max-w-sm w-full">
          <Search
            className="absolute left-2.5 top-2.5 h-4 w-4"
            style={{ color: "#B6BBC4" }}
          />
          <Input
            type="search"
            placeholder="Search problems, contests..."
            className="w-full appearance-none pl-8 shadow-none border-none"
            style={{
              backgroundColor: "#31304D",
              color: "#F0ECE5",
              borderRadius: "6px",
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          onClick={toggleDarkMode}
          size="sm"
          style={{
            backgroundColor: "#31304D",
            color: "#F0ECE5",
            border: "none",
          }}
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="ml-1 text-sm">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </Button>

        <Button
          size="sm"
          style={{
            backgroundColor: "#31304D",
            color: "#F0ECE5",
            border: "none",
          }}
        >
          Notifications
        </Button>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="" alt="User Avatar" />
              <AvatarFallback
                style={{ backgroundColor: "#B6BBC4", color: "#161A30" }}
              >
                {usernameInitials}
              </AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              onClick={handleLogout}
              style={{
                backgroundColor: "#31304D",
                color: "#F0ECE5",
                border: "none",
              }}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button
              size="sm"
              style={{
                backgroundColor: "#31304D",
                color: "#F0ECE5",
                border: "none",
              }}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
