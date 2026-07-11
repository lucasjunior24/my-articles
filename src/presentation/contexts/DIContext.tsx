import { useEffect, useState, type ReactNode } from "react";
import { createContainer } from "../../di/container";
import { DIContext, type DIContextValue } from "./DIContextDefinition";

interface DIProviderProps {
  children: ReactNode;
}

/**
 * DIProvider initializes the dependency injection container
 * and makes it available to all child components via the `useDI()` hook.
 *
 * The container is created asynchronously (IP hash resolution),
 * so the provider manages loading and error states.
 *
 * Usage:
 * ```tsx
 * <DIProvider>
 *   <App />
 * </DIProvider>
 * ```
 */
export function DIProvider({ children }: DIProviderProps) {
  const [state, setState] = useState<DIContextValue>({
    container: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function initContainer() {
      try {
        const container = await createContainer();

        if (!cancelled) {
          setState({
            container,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error
              ? err.message
              : "Falha ao inicializar o container";
          setState({
            container: null,
            isLoading: false,
            error: message,
          });
        }
      }
    }

    initContainer();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DIContext.Provider value={state}>
      {state.isLoading ? (
        <div className="flex items-center justify-center min-h-screen bg-dracula-bg">
          <div className="text-dracula-cyan text-lg animate-pulse">
            Inicializando...
          </div>
        </div>
      ) : state.error ? (
        <div className="flex items-center justify-center min-h-screen bg-dracula-bg">
          <div className="text-dracula-red text-lg">Erro: {state.error}</div>
        </div>
      ) : (
        children
      )}
    </DIContext.Provider>
  );
}
