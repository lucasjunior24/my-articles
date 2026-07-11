import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  increment,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebaseConfig";
import type { LikeRepositoryPort } from "@/core/ports/LikeRepositoryPort";
import type {
  LikeType,
  ArticleLikesSummary,
} from "@/core/entities/LikeDislike";

const LIKES_COLLECTION = "likes";
const ARTICLES_COLLECTION = "articles";

export class FirebaseLikeAdapter implements LikeRepositoryPort {
  private readonly db = getFirebaseDb();

  private getLikeDocRef(articleId: string, userId: string) {
    return doc(this.db, LIKES_COLLECTION, `${articleId}_${userId}`);
  }

  private getArticleDocRef(articleId: string) {
    return doc(this.db, ARTICLES_COLLECTION, articleId);
  }

  async toggleLike(
    articleId: string,
    userId: string,
    type: LikeType,
  ): Promise<ArticleLikesSummary> {
    const likeDocRef = this.getLikeDocRef(articleId, userId);
    const articleDocRef = this.getArticleDocRef(articleId);
    const existingLike = await getDoc(likeDocRef);

    const previousType: LikeType = existingLike.exists()
      ? (existingLike.data()?.type as LikeType)
      : "none";

    // If the same type is clicked again, remove the vote (toggle off)
    if (previousType === type) {
      await deleteDoc(likeDocRef);

      // Update article counters atomically
      const updates: Record<string, unknown> = {};
      if (type === "like") {
        updates.likeCount = increment(-1);
      } else if (type === "dislike") {
        updates.dislikeCount = increment(-1);
      }
      await updateDoc(articleDocRef, updates);
    } else {
      // Save the new vote
      await setDoc(likeDocRef, {
        userId,
        articleId,
        type,
        createdAt: Timestamp.now(),
      });

      // Update article counters atomically
      const updates: Record<string, unknown> = {};
      if (previousType === "like") {
        updates.likeCount = increment(-1);
      } else if (previousType === "dislike") {
        updates.dislikeCount = increment(-1);
      }
      if (type === "like") {
        updates.likeCount = increment(1);
      } else if (type === "dislike") {
        updates.dislikeCount = increment(1);
      }
      await updateDoc(articleDocRef, updates);
    }

    // Get updated article summary
    const articleDoc = await getDoc(articleDocRef);
    const articleData = articleDoc.data();

    return {
      articleId,
      likeCount: articleData?.likeCount ?? 0,
      dislikeCount: articleData?.dislikeCount ?? 0,
      userVote: previousType === type ? "none" : type,
    };
  }

  async getUserVote(articleId: string, userId: string): Promise<LikeType> {
    const likeDocRef = this.getLikeDocRef(articleId, userId);
    const likeDoc = await getDoc(likeDocRef);

    if (!likeDoc.exists()) {
      return "none";
    }

    return (likeDoc.data()?.type as LikeType) ?? "none";
  }

  async getArticleSummary(
    articleId: string,
  ): Promise<Omit<ArticleLikesSummary, "userVote">> {
    const articleDocRef = this.getArticleDocRef(articleId);
    const articleDoc = await getDoc(articleDocRef);
    const articleData = articleDoc.data();

    return {
      articleId,
      likeCount: articleData?.likeCount ?? 0,
      dislikeCount: articleData?.dislikeCount ?? 0,
    };
  }
}
