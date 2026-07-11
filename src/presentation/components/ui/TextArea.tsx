import type { TextareaHTMLAttributes, FC } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

/**
 * TextArea — Área de texto com label e mensagem de erro.
 *
 * @example
 * ```tsx
 * <TextArea label="Conteúdo" rows={10} />
 * <TextArea label="Descrição" error="Campo obrigatório" />
 * ```
 */
export const TextArea: FC<TextAreaProps> = ({
  label,
  error,
  id,
  className = "",
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-dracula-fg"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full px-3 py-2 rounded-lg resize-y min-h-[80px]
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
