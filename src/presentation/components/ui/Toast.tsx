import { useEffect, useState, useCallback, type FC } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const typeStyles: Record<
  ToastType,
  { bg: string; border: string; icon: string }
> = {
  success: {
    bg: "bg-dracula-green/10",
    border: "border-dracula-green/30",
    icon: "✓",
  },
  error: {
    bg: "bg-dracula-red/10",
    border: "border-dracula-red/30",
    icon: "✕",
  },
  info: {
    bg: "bg-dracula-cyan/10",
    border: "border-dracula-cyan/30",
    icon: "ℹ",
  },
  warning: {
    bg: "bg-dracula-orange/10",
    border: "border-dracula-orange/30",
    icon: "⚠",
  },
};

/**
 * ToastItem — Componente individual de notificação com animação.
 */
const ToastItem: FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const styles = typeStyles[toast.type];

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 200);
  }, [toast.id, onDismiss]);

  useEffect(() => {
    const duration = toast.duration ?? 5000;
    if (duration <= 0) return;
    const timer = setTimeout(handleDismiss, duration);
    return () => clearTimeout(timer);
  }, [toast.duration, handleDismiss]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-lg
        backdrop-blur-sm max-w-sm w-full
        ${styles.bg} ${styles.border}
        ${isExiting ? "animate-[toast-out_0.2s_ease-in_forwards]" : "animate-[toast-in_0.25s_ease-out]"}
      `}
    >
      <span
        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
          ${
            toast.type === "success"
              ? "bg-dracula-green/20 text-dracula-green"
              : toast.type === "error"
                ? "bg-dracula-red/20 text-dracula-red"
                : toast.type === "warning"
                  ? "bg-dracula-orange/20 text-dracula-orange"
                  : "bg-dracula-cyan/20 text-dracula-cyan"
          }`}
      >
        {styles.icon}
      </span>
      <p className="text-sm text-dracula-fg flex-1 leading-relaxed">
        {toast.message}
      </p>
      <button
        onClick={handleDismiss}
        className="shrink-0 text-dracula-comment hover:text-dracula-fg transition-colors text-sm leading-none p-0.5"
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Toast Container
// ---------------------------------------------------------------------------

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

/**
 * ToastContainer — Container fixo no topo direito para renderizar toasts.
 */
export const ToastContainer: FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      aria-label="Notificações"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};
