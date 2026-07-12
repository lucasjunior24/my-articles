import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useDI } from "./useDI";
import type { WriterRequest } from "../../core/entities/WriterRequest";

export interface UseWriterRequestResult {
  /** Solicitação atual do usuário, se existir */
  request: WriterRequest | null;
  /** Se está carregando a solicitação */
  isLoading: boolean;
  /** Se está enviando uma nova solicitação */
  isSubmitting: boolean;
  /** Erro, se houver */
  error: string | null;
  /** Envia uma solicitação para se tornar writer */
  requestWriter: () => Promise<void>;
  /** Recarrega o estado da solicitação */
  refresh: () => Promise<void>;
}

/**
 * Hook para gerenciar a solicitação de writer do usuário atual.
 *
 * - Mostra o status da solicitação (pending/approved/rejected)
 * - Permite ao reader solicitar para ser writer
 */
export function useWriterRequest(): UseWriterRequestResult {
  const { user } = useAuth();
  const container = useDI();
  const [request, setRequest] = useState<WriterRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setRequest(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const existing = await container.writerRequestAdapter.findByUserId(
        user.id,
      );
      setRequest(existing);
    } catch (err) {
      console.error("Erro ao buscar solicitação:", err);
      setError("Erro ao carregar status da solicitação");
    } finally {
      setIsLoading(false);
    }
  }, [user, container]);

  const requestWriter = useCallback(async () => {
    if (!user) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const newRequest = await container.requestWriterUseCase.execute(user.id);
      setRequest(newRequest);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao enviar solicitação";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [user, container]);

  return {
    request,
    isLoading,
    isSubmitting,
    error,
    requestWriter,
    refresh,
  };
}
