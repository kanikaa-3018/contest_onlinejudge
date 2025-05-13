import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
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
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback style={{ backgroundColor: "#B6BBC4", color: "#161A30" }}>
            US
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
