import { describe, it, expect } from "vitest";
import { slugify } from "../slugify";

describe("slugify (11.2.7)", () => {
  it("deve converter texto simples para slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("deve remover acentos", () => {
    expect(slugify("Ação é importante")).toBe("acao-e-importante");
  });

  it("deve substituir múltiplos espaços por hífen único", () => {
    expect(slugify("hello    world")).toBe("hello-world");
  });

  it("deve substituir hífens duplicados por hífen único", () => {
    expect(slugify("hello--world")).toBe("hello-world");
  });

  it("deve remover caracteres especiais mantendo letras e números", () => {
    expect(slugify("React 19: O Futuro é Agora!")).toBe(
      "react-19-o-futuro-e-agora",
    );
  });

  it("deve remover hífens no início e no final", () => {
    expect(slugify("  -hello world-  ")).toBe("hello-world");
  });

  it("deve retornar string vazia para entrada vazia", () => {
    expect(slugify("")).toBe("");
  });

  it("deve retornar string vazia para apenas caracteres especiais", () => {
    expect(slugify("!!!@#$%")).toBe("");
  });

  it("deve preservar números", () => {
    expect(slugify("Artigo 123 sobre TypeScript 5")).toBe(
      "artigo-123-sobre-typescript-5",
    );
  });
});
