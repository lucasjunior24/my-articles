export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  ipHash: string;
}

export function isCacheValid<T>(entry: CacheEntry<T>): boolean {
  return Date.now() - entry.timestamp < entry.ttl;
}
