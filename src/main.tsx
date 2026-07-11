import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { DIProvider } from "./presentation/contexts/DIContext";
import { AuthProvider } from "./presentation/contexts/AuthContext";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </DIProvider>
  </StrictMode>,
);
