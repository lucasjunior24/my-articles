import { describe, it, expect, vi, afterEach } from "vitest";
import { formatDate, formatDateShort, formatDateRelative } from "../dateFormat";

describe("formatDate (11.2.7)", () => {
  it("deve formatar data no padrão brasileiro", () => {
    const date = new Date(2024, 0, 15); // 15 de Janeiro de 2024
    const result = formatDate(date);
    expect(result).toContain("15");
    expect(result).toContain("janeiro");
    expect(result).toContain("2024");
  });

  it("deve formatar data com mês diferente", () => {
    const date = new Date(2024, 11, 25); // 25 de Dezembro de 2024
    const result = formatDate(date);
    expect(result).toContain("25");
    expect(result).toContain("dezembro");
    expect(result).toContain("2024");
  });
});

describe("formatDateShort (11.2.7)", () => {
  it("deve formatar data curta no padrão DD/MM/YYYY", () => {
    const date = new Date(2024, 0, 5);
    const result = formatDateShort(date);
    expect(result).toBe("05/01/2024");
  });
});

describe("formatDateRelative (11.2.7)", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve retornar "agora mesmo" para data atual', () => {
    const now = new Date();
    const result = formatDateRelative(now);
    expect(result).toBe("agora mesmo");
  });

  it('deve retornar "há X min" para minutos', () => {
    const date = new Date(Date.now() - 10 * 60 * 1000); // 10 minutos atrás
    const result = formatDateRelative(date);
    expect(result).toBe("há 10 min");
  });

  it('deve retornar "há Xh" para horas', () => {
    const date = new Date(Date.now() - 5 * 60 * 60 * 1000); // 5 horas atrás
    const result = formatDateRelative(date);
    expect(result).toBe("há 5h");
  });

  it('deve retornar "há X dias" para dias', () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // 3 dias atrás
    const result = formatDateRelative(date);
    expect(result).toBe("há 3 dias");
  });

  it("deve retornar data completa para mais de 7 dias", () => {
    const date = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000); // 10 dias atrás
    const result = formatDateRelative(date);
    // Deve ser data completa (com dia, mês, ano) - não relativa
    expect(result).not.toContain("há");
    expect(result).toMatch(/\d{2}/); // contém dia
  });
});
