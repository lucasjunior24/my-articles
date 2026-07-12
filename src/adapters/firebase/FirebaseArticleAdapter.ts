import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  type DocumentData,
  type QuerySnapshot,
  type DocumentSnapshot,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebaseConfig";
import type { ArticleRepositoryPort } from "@/core/ports/ArticleRepositoryPort";
import type {
  Article,
  CreateArticleDTO,
  UpdateArticleDTO,
} from "@/core/entities/Article";
import { slugify } from "@/shared/utils/slugify";

const COLLECTION_NAME = "articles";

function mapDocToArticle(doc: DocumentSnapshot<DocumentData>): Article | null {
  const data = doc.data();
  if (!data) return null;

  return {
    id: doc.id,
    title: data.title ?? "",
    slug: data.slug ?? "",
    content: data.content ?? "",
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? [],
    coverImage: data.coverImage ?? null,
    authorId: data.authorId ?? "",
    authorName: data.authorName ?? "",
    status: data.status ?? "draft",
    likeCount: data.likeCount ?? 0,
    dislikeCount: data.dislikeCount ?? 0,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toDate()
        : new Date(data.createdAt),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toDate()
        : new Date(data.updatedAt),
  };
}

function mapQuerySnapshotToArticles(
  snapshot: QuerySnapshot<DocumentData>,
): Article[] {
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title ?? "",
      slug: data.slug ?? "",
      content: data.content ?? "",
      excerpt: data.excerpt ?? "",
      tags: data.tags ?? [],
      coverImage: data.coverImage ?? null,
      authorId: data.authorId ?? "",
      authorName: data.authorName ?? "",
      status: data.status ?? "draft",
      likeCount: data.likeCount ?? 0,
      dislikeCount: data.dislikeCount ?? 0,
      createdAt:
        data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(data.createdAt),
      updatedAt:
        data.updatedAt instanceof Timestamp
          ? data.updatedAt.toDate()
          : new Date(data.updatedAt),
    };
  });
}

export class FirebaseArticleAdapter implements ArticleRepositoryPort {
  private readonly db = getFirebaseDb();
  private readonly collectionRef = collection(this.db, COLLECTION_NAME);

  async getAll(): Promise<Article[]> {
    const q = query(this.collectionRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return mapQuerySnapshotToArticles(snapshot);
  }

  async getById(id: string): Promise<Article | null> {
    const docRef = doc(this.db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    return mapDocToArticle(snapshot);
  }

  async getBySlug(slug: string): Promise<Article | null> {
    const q = query(this.collectionRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return mapDocToArticle(snapshot.docs[0]!);
  }

  async create(
    data: CreateArticleDTO,
    authorId: string,
    authorName: string,
  ): Promise<Article> {
    const slug = slugify(data.title);
    const now = new Date();

    const docData = {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      tags: data.tags,
      coverImage: data.coverImage ?? null,
      authorId,
      authorName,
      status: data.status ?? "draft",
      likeCount: 0,
      dislikeCount: 0,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    };
    try {
      const docRef = await addDoc(this.collectionRef, docData);
      return {
        id: docRef.id,
        ...docData,
        createdAt: now,
        updatedAt: now,
      };
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }

  async update(id: string, data: UpdateArticleDTO): Promise<Article> {
    const docRef = doc(this.db, COLLECTION_NAME, id);
    const now = new Date();

    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: Timestamp.fromDate(now),
    };

    // If title is being updated, regenerate slug
    if (data.title) {
      updateData.slug = slugify(data.title);
    }

    await updateDoc(docRef, updateData);

    // Fetch the updated document to return it
    const updatedDoc = await getDoc(docRef);
    const article = mapDocToArticle(updatedDoc);

    if (!article) {
      throw new Error(`Article with id ${id} not found after update`);
    }

    return article;
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }

  async getByAuthor(authorId: string): Promise<Article[]> {
    const q = query(
      this.collectionRef,
      where("authorId", "==", authorId),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return mapQuerySnapshotToArticles(snapshot);
  }
}
