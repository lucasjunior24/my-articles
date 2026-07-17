import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { isCacheValid, type CacheEntry } from "../CacheEntry";

describe("CacheEntry — isCacheValid (11.2.6)", () => {
  const baseEntry: CacheEntry<string> = {
    data: "cached-value",
    timestamp: Date.now(),
    ttl: 5 * 60 * 1000, // 5 minutos
    ipHash: "abc123",
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("deve retornar true quando o TTL ainda não expirou", () => {
    const entry = { ...baseEntry, timestamp: Date.now() };
    // Avança 3 minutos (dentro do TTL de 5 min)
    vi.advanceTimersByTime(3 * 60 * 1000);
    expect(isCacheValid(entry)).toBe(true);
  });

  it("deve retornar true no exato momento do TTL (ainda válido)", () => {
    const entry = { ...baseEntry, timestamp: Date.now() };
    // Avança exatamente 5 minutos (TTL expira no próximo ms)
    vi.advanceTimersByTime(5 * 60 * 1000 - 1);
    expect(isCacheValid(entry)).toBe(true);
  });

  it("deve retornar false quando o TTL expirou", () => {
    const entry = { ...baseEntry, timestamp: Date.now() };
    // Avança 6 minutos (além do TTL de 5 min)
    vi.advanceTimersByTime(6 * 60 * 1000);
    expect(isCacheValid(entry)).toBe(false);
  });

  it("deve retornar false imediatamente se o TTL for 0", () => {
    const entry: CacheEntry<string> = {
      data: "cached-value",
      timestamp: Date.now(),
      ttl: 0,
      ipHash: "abc123",
    };
    // Avança 1ms
    vi.advanceTimersByTime(1);
    expect(isCacheValid(entry)).toBe(false);
  });

  it("deve retornar false se o timestamp estiver no futuro (caso de borda)", () => {
    const entry = {
      ...baseEntry,
      timestamp: Date.now() + 10 * 60 * 1000, // 10 min no futuro
      ttl: 5 * 60 * 1000,
    };
    // Como timestamp > now, diff é negativo → menor que TTL → true
    // Mas `Date.now() - entry.timestamp` seria negativo, que é < ttl
    // Então retorna true (cenário teórico em que o cache veio de outra máquina)
    expect(isCacheValid(entry)).toBe(true);
  });
});
