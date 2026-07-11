import type { FC } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * MarkdownRenderer — Renderiza conteúdo Markdown com estilo Dracula Dark.
 *
 * Utiliza react-markdown para renderização segura (sem dangerouslySetInnerHTML).
 * Estiliza headings, código, links, listas, blockquotes e outros elementos
 * com as cores do tema Dracula.
 *
 * @example
 * ```tsx
 * <MarkdownRenderer content={article.content} />
 * ```
 */
export const MarkdownRenderer: FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  const components: Components = {
    // Headings
    h1: ({ children, ...props }) => (
      <h1
        className="text-3xl font-bold text-dracula-pink mt-8 mb-4 pb-2 border-b border-dracula-current"
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="text-2xl font-bold text-dracula-cyan mt-8 mb-3 pb-1 border-b border-dracula-current/50"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3
        className="text-xl font-semibold text-dracula-green mt-6 mb-2"
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4
        className="text-lg font-semibold text-dracula-orange mt-5 mb-2"
        {...props}
      >
        {children}
      </h4>
    ),

    // Paragraph
    p: ({ children, ...props }) => (
      <p className="text-dracula-fg leading-relaxed mb-4" {...props}>
        {children}
      </p>
    ),

    // Links
    a: ({ children, href, ...props }) => (
      <a
        href={href}
        className="text-dracula-cyan hover:text-dracula-pink underline underline-offset-2 transition-colors duration-200"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    ),

    // Code blocks
    code: ({ children, className: codeClassName, ...props }) => {
      const isInline = !codeClassName;
      return isInline ? (
        <code
          className="px-1.5 py-0.5 rounded bg-dracula-current text-dracula-pink text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      ) : (
        <code
          className={`block p-4 rounded-lg bg-dracula-current/70 text-dracula-green text-sm font-mono overflow-x-auto my-4 ${codeClassName ?? ""}`}
          {...props}
        >
          {children}
        </code>
      );
    },

    // Pre (code blocks wrapper)
    pre: ({ children, ...props }) => (
      <pre className="mb-4" {...props}>
        {children}
      </pre>
    ),

    // Lists
    ul: ({ children, ...props }) => (
      <ul
        className="list-disc list-inside text-dracula-fg mb-4 space-y-1"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="list-decimal list-inside text-dracula-fg mb-4 space-y-1"
        {...props}
      >
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="text-dracula-fg leading-relaxed" {...props}>
        {children}
      </li>
    ),

    // Blockquotes
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-l-4 border-dracula-purple pl-4 py-1 my-4 text-dracula-comment italic bg-dracula-current/20 rounded-r-lg"
        {...props}
      >
        {children}
      </blockquote>
    ),

    // Horizontal rule
    hr: ({ ...props }) => (
      <hr className="border-dracula-current my-8" {...props} />
    ),

    // Images
    img: ({ src, alt, ...props }) => (
      <img
        src={src}
        alt={alt ?? ""}
        className="rounded-lg max-w-full h-auto my-6 mx-auto"
        loading="lazy"
        {...props}
      />
    ),

    // Tables
    table: ({ children, ...props }) => (
      <div className="overflow-x-auto my-6">
        <table
          className="min-w-full border-collapse border border-dracula-current text-dracula-fg"
          {...props}
        >
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th
        className="border border-dracula-current bg-dracula-current/50 px-4 py-2 text-dracula-cyan font-semibold text-left"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border border-dracula-current px-4 py-2" {...props}>
        {children}
      </td>
    ),

    // Strong and Emphasis
    strong: ({ children, ...props }) => (
      <strong className="text-dracula-purple font-bold" {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className="text-dracula-yellow italic" {...props}>
        {children}
      </em>
    ),
  };

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
};
