import type { ButtonHTMLAttributes, FC } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-dracula-pink text-dracula-bg hover:bg-dracula-pink/90 focus-visible:ring-dracula-pink",
  secondary:
    "bg-dracula-current text-dracula-fg hover:bg-dracula-current/80 focus-visible:ring-dracula-current",
  danger:
    "bg-dracula-red text-white hover:bg-dracula-red/90 focus-visible:ring-dracula-red",
  ghost:
    "bg-transparent text-dracula-fg hover:bg-dracula-current/50 focus-visible:ring-dracula-current",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2 text-base gap-2",
  lg: "px-6 py-3 text-lg gap-2.5",
};

/**
 * Button — Botão reutilizável com variantes e estado de loading.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Salvar
 * </Button>
 * <Button variant="danger" isLoading>
 *   Excluindo...
 * </Button>
 * ```
 */
export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className = "",
  ...props
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dracula-bg
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner
          size={size === "lg" ? "sm" : "sm"}
          className="shrink-0"
        />
      )}
      {children}
    </button>
  );
};
