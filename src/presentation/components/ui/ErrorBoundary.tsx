import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./Button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — Componente de classe que captura erros na árvore de componentes
 * e exibe uma UI de fallback.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8">
          <span className="text-5xl">💥</span>
          <div className="text-center">
            <h2 className="text-xl font-bold text-dracula-red mb-2">
              Algo deu errado
            </h2>
            <p className="text-dracula-comment max-w-md">
              Ocorreu um erro inesperado. Tente recarregar a página ou voltar
              para a página inicial.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={this.handleRetry}>
              Tentar novamente
            </Button>
            <Button
              variant="ghost"
              onClick={() => (window.location.href = "/")}
            >
              Voltar ao início
            </Button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre className="text-xs text-dracula-red/60 max-w-lg overflow-auto p-4 rounded bg-dracula-current/30">
              {this.state.error.message}
              {this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
