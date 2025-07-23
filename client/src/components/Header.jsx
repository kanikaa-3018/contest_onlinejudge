import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Moon, Sun, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export const Header = ({ toggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [usernameInitials, setUsernameInitials] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // No changes needed in logic functions
  const updateUserStatus = () => {
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
          return;
        }
      } catch {
        console.warn("Failed to parse user from localStorage.");
      }
    }
    setIsLoggedIn(false);
    setUsernameInitials(null);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    updateUserStatus();

    window.addEventListener("userStatusChanged", updateUserStatus);
    return () =>
      window.removeEventListener("userStatusChanged", updateUserStatus);
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
    localStorage.removeItem("user");
    localStorage.removeItem("cfHandle");
    localStorage.removeItem("lcHandle");
    window.dispatchEvent(new Event("userStatusChanged"));
  };

  return (
    // CORRECTED: Replaced inline styles with theme-aware classes
    <header className="flex h-14 items-center gap-4 border-b border-border bg-card px-4 lg:px-6 justify-between">
      {/* Left section: search & hamburger */}
      <div className="flex items-center gap-4 flex-1">
        {toggleSidebar && (
          <button className="sm:hidden" onClick={toggleSidebar}>
            <Menu className="h-6 w-6 text-foreground" />
          </button>
        )}

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          {/* CORRECTED: Replaced inline styles with theme-aware classes */}
          <Input
            type="search"
            placeholder="Search problems, contests..."
            className="w-full appearance-none rounded-md border-none bg-background pl-8 shadow-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* CORRECTED: Replaced inline styles with theme-aware classes */}
        <Button onClick={toggleDarkMode} size="icon" variant="ghost">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="" alt="User Avatar" />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {usernameInitials}
              </AvatarFallback>
            </Avatar>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button size="sm" variant="ghost">
              Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;