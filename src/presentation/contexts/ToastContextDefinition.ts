import { createContext } from "react";
import type { ToastType } from "../components/ui/Toast";

/**
 * ToastContextValue — Interface do contexto de notificações toast.
 */
export interface ToastContextValue {
  addToast: (message: string, type?: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
