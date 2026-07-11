import type { CacheEntry } from "../entities/CacheEntry";

export interface CachePort {
  get<T>(key: string): Promise<CacheEntry<T> | null>;
  set<T>(key: string, data: T, ttl: number): Promise<void>;
  invalidate(key: string): Promise<void>;
  invalidateByPrefix(prefix: string): Promise<void>;
}
