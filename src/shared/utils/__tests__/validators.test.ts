import { describe, it, expect } from "vitest";
import {
  isValidTitle,
  isValidContent,
  isValidExcerpt,
  isValidTags,
  isValidEmail,
  isValidSlug,
} from "../validators";

describe("validators (11.2.7)", () => {
  describe("isValidTitle", () => {
    it("deve validar título com tamanho mínimo (3 caracteres)", () => {
      expect(isValidTitle("abc")).toBe(true);
    });

    it("deve validar título com tamanho máximo (200 caracteres)", () => {
      expect(isValidTitle("a".repeat(200))).toBe(true);
    });

    it("deve rejeitar título menor que 3 caracteres", () => {
      expect(isValidTitle("ab")).toBe(false);
    });

    it("deve rejeitar título maior que 200 caracteres", () => {
      expect(isValidTitle("a".repeat(201))).toBe(false);
    });

    it("deve considerar apenas texto após trim", () => {
      expect(isValidTitle("  ab  ")).toBe(false);
    });
  });

  describe("isValidContent", () => {
    it("deve validar conteúdo com pelo menos 10 caracteres", () => {
      expect(isValidContent("Conteúdo válido aqui")).toBe(true);
    });

    it("deve rejeitar conteúdo com menos de 10 caracteres", () => {
      expect(isValidContent("Curto")).toBe(false);
    });

    it("deve rejeitar conteúdo vazio", () => {
      expect(isValidContent("")).toBe(false);
    });
  });

  describe("isValidExcerpt", () => {
    it("deve validar excerpt entre 10 e 500 caracteres", () => {
      expect(isValidExcerpt("Resumo válido do artigo")).toBe(true);
    });

    it("deve rejeitar excerpt menor que 10 caracteres", () => {
      expect(isValidExcerpt("Curto")).toBe(false);
    });

    it("deve rejeitar excerpt maior que 500 caracteres", () => {
      expect(isValidExcerpt("a".repeat(501))).toBe(false);
    });
  });

  describe("isValidTags", () => {
    it("deve validar array de tags não vazio", () => {
      expect(isValidTags(["react", "typescript"])).toBe(true);
    });

    it("deve rejeitar array vazio", () => {
      expect(isValidTags([])).toBe(false);
    });

    it("deve rejeitar tag com string vazia ou apenas espaços", () => {
      expect(isValidTags(["react", " "])).toBe(false);
      expect(isValidTags(["react", ""])).toBe(false);
    });
  });

  describe("isValidEmail", () => {
    it("deve validar emails válidos", () => {
      expect(isValidEmail("teste@email.com")).toBe(true);
      expect(isValidEmail("nome.sobrenome@dominio.org")).toBe(true);
    });

    it("deve rejeitar emails inválidos", () => {
      expect(isValidEmail("semarroba")).toBe(false);
      expect(isValidEmail("@semnome.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("isValidSlug", () => {
    it("deve validar slugs válidos", () => {
      expect(isValidSlug("hello-world")).toBe(true);
      expect(isValidSlug("artigo-123")).toBe(true);
      expect(isValidSlug("a")).toBe(true);
    });

    it("deve rejeitar slugs inválidos", () => {
      expect(isValidSlug("Hello World")).toBe(false);
      expect(isValidSlug("UPPERCASE")).toBe(false);
      expect(isValidSlug("espaços são inválidos")).toBe(false);
      expect(isValidSlug("-comeca-com-hifen")).toBe(false);
      expect(isValidSlug("termina-com-hifen-")).toBe(false);
    });
  });
});
