import { BUSINESS_NAME, WHATSAPP_NUMBER, services, whatsappMessages } from "./config.js";

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
  else if (project.description.length > 1500) errors.description = "Resuma sua necessidade em até 1.500 caracteres.";

  return { project, errors, valid: Object.keys(errors).length === 0 };
}

export function createMessage(project) {
  return [
    whatsappMessages[project.service] || whatsappMessages.general,
    "",
    `Nome: ${project.name}`,
    `Serviço: ${services[project.service]}`,
    "",
    "O que está acontecendo:",
    project.description
  ].join("\n");
}

export function getContactMode(number) {
  if (typeof number !== "string") return "unavailable";
  if (number.trim() === "" || /^55D{2}X{9}$/.test(number)) return "demo";
  // International format: 8–15 digits, no leading zero; account ownership is not verified.
  return /^[1-9]\d{7,14}$/.test(number) ? "whatsapp" : "unavailable";
}

export function prepareContact(values, number) {
  const validation = validateProject(values);
  if (!validation.valid) return { ...validation, mode: null, message: "", url: null };

  const message = createMessage(validation.project);
  const mode = getContactMode(number);
  return { ...validation, mode, message, url: createWhatsAppLink(number, message) };
}

export function createWhatsAppLink(number = WHATSAPP_NUMBER, message = whatsappMessages.general) {
  if (getContactMode(number) !== "whatsapp") return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function getContactAction(number, context = "general") {
  const actions = {
    general: ["Solicitar orçamento", "Preparar pedido"],
    network: ["Solicitar orçamento de rede", "Preparar pedido de rede"],
    support: ["Solicitar suporte técnico", "Preparar pedido de suporte"],
    hardware: ["Solicitar manutenção", "Preparar pedido de manutenção"],
    other: ["Conversar sobre meu pedido", "Preparar pedido"]
  };
  const key = Object.hasOwn(actions, context) ? context : "general";
  const url = createWhatsAppLink(number, whatsappMessages[key]);
  const label = actions[key][url ? 0 : 1];
  return {
    href: url || "#contact-form",
    label,
    ariaLabel: url ? `${label} com a ${BUSINESS_NAME} pelo WhatsApp (abre em outra aba)` : `${label} para copiar; envio à Datar indisponível no momento`,
    external: Boolean(url),
    service: key === "general" ? null : key
  };
}

export function formatWhatsAppNumber(number = WHATSAPP_NUMBER) {
  if (getContactMode(number) !== "whatsapp") return "";
  if (/^55\d{10,11}$/.test(number)) {
    return number.replace(/^55(.{2})(.{4,5})(.{4})$/, "+55 ($1) $2-$3");
  }
  return `+${number}`;
}

export function updateBusinessSchema(schema, number, details) {
  const updated = structuredClone(schema);
  if (updated.name !== BUSINESS_NAME) throw new Error("Unexpected business schema");
  if (details.streetAddress) updated.address.streetAddress = details.streetAddress;
  if (details.postalCode) updated.address.postalCode = details.postalCode;
  if (details.email) updated.email = details.email;
  if (details.cnpj) updated.taxID = details.cnpj;
  if (details.socialLinks.length) updated.sameAs = [...details.socialLinks];
  updated.areaServed = [...schema.areaServed, ...details.servedCities.map(name => ({ "@type": "City", name }))];
  const url = createWhatsAppLink(number);
  if (url) {
    updated.telephone = `+${number}`;
    updated.contactPoint.telephone = `+${number}`;
    updated.contactPoint.url = url;
  } else {
    delete updated.telephone;
    delete updated.contactPoint.telephone;
    delete updated.contactPoint.url;
  }
  return updated;
}
