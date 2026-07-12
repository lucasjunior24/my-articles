import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
  type DocumentSnapshot,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebaseConfig";
import type { WriterRequestRepositoryPort } from "@/core/ports/WriterRequestRepositoryPort";
import type {
  WriterRequest,
  CreateWriterRequestDTO,
  UpdateWriterRequestDTO,
} from "@/core/entities/WriterRequest";

const COLLECTION_NAME = "writerRequests";

function mapDocToWriterRequest(
  doc: DocumentSnapshot<DocumentData>,
): WriterRequest | null {
  const data = doc.data();
  if (!data) return null;

  return {
    id: doc.id,
    userId: data.userId ?? "",
    userEmail: data.userEmail ?? "",
    userDisplayName: data.userDisplayName ?? "",
    status: (data.status as "pending" | "approved" | "rejected") ?? "pending",
    requestedAt:
      data.requestedAt instanceof Timestamp
        ? data.requestedAt.toDate()
        : new Date(data.requestedAt),
    reviewedAt:
      data.reviewedAt instanceof Timestamp
        ? data.reviewedAt.toDate()
        : undefined,
    reviewedBy: (data.reviewedBy as string | undefined) ?? undefined,
  };
}

function mapQuerySnapshotToWriterRequests(
  snapshot: QuerySnapshot<DocumentData>,
): WriterRequest[] {
  return snapshot.docs
    .map((doc) => mapDocToWriterRequest(doc))
    .filter((req): req is WriterRequest => req !== null);
}

export class FirebaseWriterRequestAdapter implements WriterRequestRepositoryPort {
  private readonly db = getFirebaseDb();
  private readonly collectionRef = collection(this.db, COLLECTION_NAME);

  async createRequest(dto: CreateWriterRequestDTO): Promise<WriterRequest> {
    const now = Timestamp.now();

    const docData = {
      userId: dto.userId,
      userEmail: dto.userEmail,
      userDisplayName: dto.userDisplayName,
      status: "pending",
      requestedAt: now,
    };

    const docRef = await addDoc(this.collectionRef, docData);

    return {
      id: docRef.id,
      userId: dto.userId,
      userEmail: dto.userEmail,
      userDisplayName: dto.userDisplayName,
      status: "pending" as const,
      requestedAt: now.toDate(),
      reviewedAt: undefined,
      reviewedBy: undefined,
    };
  }

  async findByUserId(userId: string): Promise<WriterRequest | null> {
    const q = query(
      this.collectionRef,
      where("userId", "==", userId),
      orderBy("requestedAt", "desc"),
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    // Retorna a solicitação mais recente (primeira após ordenação desc)
    return mapDocToWriterRequest(snapshot.docs[0]!);
  }

  async findAll(
    status?: "pending" | "approved" | "rejected",
  ): Promise<WriterRequest[]> {
    let q;

    if (status) {
      q = query(
        this.collectionRef,
        where("status", "==", status),
        orderBy("requestedAt", "desc"),
      );
    } else {
      q = query(this.collectionRef, orderBy("requestedAt", "desc"));
    }

    const snapshot = await getDocs(q);
    return mapQuerySnapshotToWriterRequests(snapshot);
  }

  async updateRequest(
    requestId: string,
    dto: UpdateWriterRequestDTO,
  ): Promise<WriterRequest> {
    const docRef = doc(this.db, COLLECTION_NAME, requestId);

    const updateData: Record<string, unknown> = {
      status: dto.status,
      reviewedBy: dto.reviewedBy,
      reviewedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);

    // Fetch the updated document
    const updatedDoc = await getDoc(docRef);
    const request = mapDocToWriterRequest(updatedDoc);

    if (!request) {
      throw new Error(
        `Solicitação com id ${requestId} não encontrada após atualização`,
      );
    }

    return request;
  }
}
