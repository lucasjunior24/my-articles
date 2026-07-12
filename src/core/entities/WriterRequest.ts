import type { Timestamp } from "firebase/firestore";

export type WriterRequestStatus = "pending" | "approved" | "rejected";

/**
 * Representa uma solicitação de um reader para se tornar writer.
 *
 * Coleção no Firestore: `writerRequests`
 */
export interface WriterRequest {
  id: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  status: WriterRequestStatus;
  requestedAt: Date;
  reviewedAt: Date | undefined;
  reviewedBy: string | undefined;
}

/**
 * DTO para criar uma nova solicitação de writer.
 */
export interface CreateWriterRequestDTO {
  userId: string;
  userEmail: string;
  userDisplayName: string;
}

/**
 * DTO para admin aprovar ou rejeitar uma solicitação.
 */
export interface UpdateWriterRequestDTO {
  status: "approved" | "rejected";
  reviewedBy: string;
}

/**
 * Tipo usado no adapter Firebase, onde Timestamp é nativo do Firestore.
 */
export interface FirestoreWriterRequest {
  id: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  status: WriterRequestStatus;
  requestedAt: Timestamp;
  reviewedAt?: Timestamp;
  reviewedBy?: string;
}
