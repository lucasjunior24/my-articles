import type { InputHTMLAttributes, FC } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
}

/**
 * Input — Campo de entrada com label e mensagem de erro.
 *
 * @example
 * ```tsx
 * <Input label="Título" placeholder="Digite o título" />
 * <Input label="Email" error="Email inválido" />
 * ```
 */
export const Input: FC<InputProps> = ({
  label,
  error,
  id,
  className = "",
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-dracula-fg"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-2 rounded-lg
          bg-dracula-current text-dracula-fg
          border border-dracula-current
          placeholder:text-dracula-comment
          transition-colors duration-200
          focus:outline-none focus:border-dracula-pink focus:ring-1 focus:ring-dracula-pink
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-dracula-red focus:border-dracula-red focus:ring-dracula-red" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-sm text-dracula-red" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
