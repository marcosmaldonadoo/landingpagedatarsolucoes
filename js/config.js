export const BUSINESS_NAME = "Datar Soluções Tecnológicas";

// TODO: Replace with the real number (55 + area code + number, digits only).
export const WHATSAPP_NUMBER = "55DDXXXXXXXXX";

export const whatsappMessages = Object.freeze({
  general: "Olá, Datar Soluções Tecnológicas! Preciso de suporte de TI. Posso contar o que está acontecendo e informar minha cidade?",
  hardware: "Olá, Datar Soluções Tecnológicas! Preciso de conserto ou manutenção do meu computador. Posso descrever o problema?",
  network: "Olá, Datar Soluções Tecnológicas! Preciso de ajuda com a rede da minha empresa. Posso contar como ela funciona e o que preciso melhorar?",
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
  hardware: "Conserto e manutenção preventiva",
  consulting: "Consultoria de TI",
  network: "Redes para empresas",
  guidance: "Ainda não sei do que preciso"
});
