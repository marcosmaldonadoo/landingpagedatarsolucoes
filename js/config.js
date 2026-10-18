export const BUSINESS_NAME = "Datar Soluções Tecnológicas";

// TODO: Replace with the real number (55 + area code + number, digits only).
export const WHATSAPP_NUMBER = "";

export const whatsappMessages = Object.freeze({
  general: "Olá, Datar Soluções Tecnológicas! Gostaria de solicitar um orçamento. Posso contar do que preciso e informar minha cidade?",
  hardware: "Olá, Datar Soluções Tecnológicas! Preciso de conserto ou manutenção do meu computador. Posso descrever o problema?",
  network: "Olá, Datar Soluções Tecnológicas! Gostaria de um orçamento para a rede de computadores da minha empresa. Posso explicar a necessidade?",
  support: "Olá, Datar Soluções Tecnológicas! Preciso de suporte técnico de TI. Posso descrever o problema e informar minha cidade?",
  other: "Olá, Datar Soluções Tecnológicas! Tenho uma necessidade de TI e gostaria de uma orientação. Posso explicar o que preciso?",
  consulting: "Olá, Datar Soluções Tecnológicas! Gostaria de uma consultoria de TI. Posso explicar minha necessidade e pedir uma orientação?"
});

export const siteConfig = Object.freeze({ whatsappNumber: WHATSAPP_NUMBER });

export const businessDetails = Object.freeze({
  certifications: [], // TODO: Add only verified certification names.
  streetAddress: "", // TODO: Fill in the real street address, if publicly available.
  postalCode: "", // TODO: Fill in the real postal code.
  cnpj: "", // TODO: Fill in the real CNPJ, if it will be published.
  email: "", // TODO: Fill in the real public contact email.
  socialLinks: [], // TODO: Add official social profile URLs only.
  servedCities: [] // TODO: Add confirmed neighboring cities; no coverage is assumed.
});

export const services = Object.freeze({
  network: "Montagem e organização de redes empresariais",
  support: "Suporte técnico de TI",
  hardware: "Manutenção de computadores",
  other: "Outros serviços de TI",
  guidance: "Ainda não sei do que preciso"
});
