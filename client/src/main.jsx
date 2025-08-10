import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import ".././src/index.css";
import App from "./App.jsx";
// import "@uiw/react-md-editor/markdown-editor.css";
// import "@uiw/react-markdown-preview/markdown.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Root() {
  const [toastTheme, setToastTheme] = useState(
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  useEffect(() => {
    const handler = (e) => setToastTheme(e.detail?.theme === "dark" ? "dark" : "light");
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  return (
    <StrictMode>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={toastTheme}
      />
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
