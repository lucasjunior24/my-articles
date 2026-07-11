import type { CachePort } from "@/core/ports/CachePort";
import type { CacheEntry } from "@/core/entities/CacheEntry";
import { isCacheValid } from "@/core/entities/CacheEntry";

const STORAGE_PREFIX = "blog_cache";

/**
 * IPCacheAdapter implements CachePort using localStorage.
 * Keys are composed as: {prefix}_{key}_{ip_hash}
 * This ensures cache isolation per user IP.
 */
export class IPCacheAdapter implements CachePort {
  private readonly ipHash: string;

  constructor(ipHash: string) {
    this.ipHash = ipHash;
  }

  private buildKey(key: string): string {
    return `${STORAGE_PREFIX}_${key}_${this.ipHash}`;
  }

  async get<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const storageKey = this.buildKey(key);
      const raw = localStorage.getItem(storageKey);

      if (!raw) {
        return null;
      }

      const entry = JSON.parse(raw) as CacheEntry<T>;

      if (!isCacheValid(entry)) {
        // Remove expired entry
        localStorage.removeItem(storageKey);
        return null;
      }

      return entry;
    } catch {
      return null;
    }
  }

  async set<T>(key: string, data: T, ttl: number): Promise<void> {
    try {
      const storageKey = this.buildKey(key);
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
        ipHash: this.ipHash,
      };

      localStorage.setItem(storageKey, JSON.stringify(entry));
    } catch {
      // localStorage might be full or unavailable
      console.warn("IPCacheAdapter: Failed to set cache entry", key);
    }
  }

  async invalidate(key: string): Promise<void> {
    try {
      const storageKey = this.buildKey(key);
      localStorage.removeItem(storageKey);
    } catch {
      console.warn("IPCacheAdapter: Failed to invalidate cache entry", key);
    }
  }

  async invalidateByPrefix(prefix: string): Promise<void> {
    try {
      const keysToRemove: string[] = [];

      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);

        if (
          storageKey &&
          storageKey.startsWith(`${STORAGE_PREFIX}_${prefix}`) &&
          storageKey.endsWith(this.ipHash)
        ) {
          keysToRemove.push(storageKey);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch {
      console.warn(
        "IPCacheAdapter: Failed to invalidate cache by prefix",
        prefix,
      );
    }
  }
}
