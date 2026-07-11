import { useEffect, useCallback, type FC, type ReactNode } from "react";
import { Icon } from "./Icon";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/**
 * Modal — Modal com overlay, título e botão de fechar.
 *
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirmar">
 *   <p>Deseja realmente excluir?</p>
 * </Modal>
 * ```
 */
export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative w-full max-w-md rounded-xl bg-dracula-bg border border-dracula-current shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dracula-current">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-dracula-fg"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-dracula-comment hover:text-dracula-fg hover:bg-dracula-current transition-colors"
            aria-label="Fechar"
          >
            <Icon name="x-mark" size="md" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};
