import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '.././src/index.css'
import App from './App.jsx'
// import "@uiw/react-md-editor/markdown-editor.css";
// import "@uiw/react-markdown-preview/markdown.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
