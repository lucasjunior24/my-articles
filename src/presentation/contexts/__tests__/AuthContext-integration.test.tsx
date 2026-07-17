import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { AuthContext, type AuthContextValue } from "../AuthContextDefinition";
import { useAuth } from "../../hooks/useAuth";
import type { AppUser } from "../../../core/entities/User";

// ─── Testes de Integração ──────────────────────────────────────────

describe("AuthContext + useAuth (11.4.1)", () => {
  const mockUser: AppUser = {
    id: "user-1",
    displayName: "Test User",
    email: "test@test.com",
    photoURL: null,
    role: "admin",
  };

  function createWrapper(value: AuthContextValue) {
    return ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  }

  it("useAuth retorna isAdmin = true para admin", () => {
    const wrapper = createWrapper({
      user: mockUser,
      isLoading: false,
      isAdmin: true,
      isWriter: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.user?.role).toBe("admin");
  });

  it("useAuth retorna isWriter = true para writer", () => {
    const writerUser: AppUser = { ...mockUser, role: "writer" };
    const wrapper = createWrapper({
      user: writerUser,
      isLoading: false,
      isAdmin: false,
      isWriter: true,
      login: vi.fn(),
      logout: vi.fn(),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isWriter).toBe(true);
    expect(result.current.user?.role).toBe("writer");
  });

  it("useAuth lança erro se usado fora do AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth deve ser usado dentro de um <AuthProvider>",
    );
  });
});
