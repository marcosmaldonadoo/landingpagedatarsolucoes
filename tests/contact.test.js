import { describe, expect, test } from "bun:test";
import { getContactMode, prepareContact, validateProject } from "../js/contact.js";

const validProject = {
  name: "Ana Luísa",
  service: "landing-page",
  description: "Quero apresentar meu estúdio e facilitar pedidos de orçamento."
};

describe("Validação do orçamento", () => {
  test("indica todos os campos ausentes, inclusive entradas compostas de espaços", () => {
    const result = validateProject({ name: "   ", service: "", description: "\n  " });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors)).toEqual(["name", "service", "description"]);
  });

  test("preserva nomes com acentos e normaliza espaços sem exigir sobrenome", () => {
    const result = validateProject({ ...validProject, name: "  João   D'Ávila  " });
    expect(result.valid).toBe(true);
    expect(result.project.name).toBe("João D'Ávila");
    expect(validateProject({ ...validProject, name: "Li" }).valid).toBe(true);
  });

  test("recusa um serviço que não está na configuração", () => {
    for (const service of ["unknown", "__proto__", "toString"]) {
      expect(validateProject({ ...validProject, service }).errors.service).toBeDefined();
    }
  });

  test("aplica os limites mínimos e máximos mesmo em entradas programáticas", () => {
    expect(validateProject({ ...validProject, name: "A" }).errors.name).toBeDefined();
    expect(validateProject({ ...validProject, name: "A".repeat(101) }).errors.name).toBeDefined();
    expect(validateProject({ ...validProject, description: "a".repeat(19) }).errors.description).toBeDefined();
    expect(validateProject({ ...validProject, description: "a".repeat(1501) }).errors.description).toBeDefined();
    expect(validateProject({ ...validProject, description: "a".repeat(20) }).valid).toBe(true);
    expect(validateProject({ ...validProject, description: "a".repeat(1500) }).valid).toBe(true);
  });
});

describe("Preparação segura do contato", () => {
  test("modo demonstrativo produz uma prévia sem URL externa", () => {
    const result = prepareContact(validProject, "");
    expect(result.mode).toBe("demo");
    expect(result.url).toBeNull();
    expect(result.message).toContain("Nome: Ana Luísa");
    expect(result.message).toContain("Serviço: Landing page");
  });

  test("configurações inválidas nunca produzem um link de contato", () => {
    for (const number of [null, 5511999999999, "+55 (11) 99999-9999", "0123456789", "123", "12345678?text=other", "5511999999999 "]) {
      expect(getContactMode(number)).toBe("unavailable");
      expect(prepareContact(validProject, number).url).toBeNull();
    }
    expect(getContactMode("   ")).toBe("demo");
  });

  test("dados inválidos não geram uma mensagem nem um link", () => {
    const result = prepareContact({ ...validProject, service: "" }, "5511999999999");
    expect(result.valid).toBe(false);
    expect(result.url).toBeNull();
    expect(result.message).toBe("");
  });

  test("a URL conserva acentos, quebras de linha e caracteres especiais com encodeURIComponent", () => {
    const description = "Minha ideia: integração A&B? plano=novo #site + café ☕\nSegunda linha com 100% de atenção.";
    const result = prepareContact({ ...validProject, description }, "5511999999999");
    const url = new URL(result.url);
    expect(result.mode).toBe("whatsapp");
    expect(url.origin).toBe("https://wa.me");
    expect(url.searchParams.get("text")).toBe(result.message);
    expect(url.searchParams.size).toBe(1);
    expect(url.hash).toBe("");
    expect(result.message).toContain(description);
    expect(result.url).toContain(encodeURIComponent(description));
  });
});
