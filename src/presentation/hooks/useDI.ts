import { useContext } from "react";
import { DIContext } from "../contexts/DIContextDefinition";
import type { Container } from "../../di/types";

/**
 * Hook to access the dependency injection container.
 * Must be used within a <DIProvider>.
 *
 * Returns the container with all adapters and use cases.
 *
 * @throws If used outside of DIProvider
 *
 * @example
 * ```tsx
 * const container = useDI();
 * const articles = await container.getArticlesUseCase.execute(ipHash);
 * ```
 */
export function useDI(): Container {
  const context = useContext(DIContext);

  if (!context) {
    throw new Error("useDI deve ser usado dentro de um <DIProvider>");
  }

  if (!context.container) {
    throw new Error(
      "Container DI não está disponível. Verifique se o DIProvider foi montado corretamente.",
    );
  }

  return context.container;
}
