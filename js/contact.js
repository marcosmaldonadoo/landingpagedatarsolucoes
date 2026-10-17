import { services } from "./config.js";

export function normalizeProject(values) {
  return {
    name: String(values.name ?? "").trim().replace(/\s+/gu, " "),
    service: String(values.service ?? ""),
    description: String(values.description ?? "").trim()
  };
}

export function validateProject(values) {
  const project = normalizeProject(values);
  const errors = {};

  if (project.name.length < 2) errors.name = "Informe seu nome com pelo menos 2 caracteres.";
  else if (project.name.length > 100) errors.name = "Use até 100 caracteres no nome.";

  if (!Object.hasOwn(services, project.service)) errors.service = "Selecione o serviço que você procura.";

  if (project.description.length < 20) errors.description = "Conte um pouco mais: use pelo menos 20 caracteres na descrição.";
  else if (project.description.length > 1500) errors.description = "Resuma sua ideia em até 1.500 caracteres.";

  return { project, errors, valid: Object.keys(errors).length === 0 };
}

export function createMessage(project) {
  return [
    "Olá, TechNova! Gostaria de conversar sobre um projeto.",
    "",
    `Nome: ${project.name}`,
    `Serviço: ${services[project.service]}`,
    "",
    "Sobre a minha ideia:",
    project.description
  ].join("\n");
}

export function getContactMode(number) {
  if (typeof number !== "string") return "unavailable";
  if (number.trim() === "") return "demo";
  // Formato internacional: 8–15 dígitos, sem zero inicial. Não comprova existência da conta.
  return /^[1-9]\d{7,14}$/.test(number) ? "whatsapp" : "unavailable";
}

export function prepareContact(values, number) {
  const validation = validateProject(values);
  if (!validation.valid) return { ...validation, mode: null, message: "", url: null };

  const message = createMessage(validation.project);
  const mode = getContactMode(number);
  return {
    ...validation,
    mode,
    message,
    url: mode === "whatsapp" ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : null
  };
}
