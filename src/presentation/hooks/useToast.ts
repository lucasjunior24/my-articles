import { useContext } from "react";
import {
  ToastContext,
  type ToastContextValue,
} from "../contexts/ToastContextDefinition";

/**
 * useToast — Hook para acessar o sistema de notificações toast.
 *
 * @throws Se usado fora de um <ToastProvider>
 *
 * @example
 * ```tsx
 * const toast = useToast();
 * toast.success("Artigo criado com sucesso!");
 * toast.error("Erro ao carregar dados");
 * ```
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast deve ser usado dentro de um <ToastProvider>");
  }
  return context;
}
