import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./presentation/components/ui/ErrorBoundary";
import "./index.css";
import { DIProvider } from "./presentation/contexts/DIContext";
import { AuthProvider } from "./presentation/contexts/AuthContext";
import { ToastProvider } from "./presentation/contexts/ToastContext";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <DIProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </DIProvider>
    </ErrorBoundary>
  </StrictMode>,
);
