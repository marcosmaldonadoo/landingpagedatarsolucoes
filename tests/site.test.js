import { describe, expect, test } from "bun:test";
import { BUSINESS_NAME, WHATSAPP_NUMBER, businessDetails, services, whatsappMessages } from "../js/config.js";
import { createWhatsAppLink, formatWhatsAppNumber, getContactMode, updateBusinessSchema } from "../js/contact.js";

const html = await Bun.file(new URL("../index.html", import.meta.url)).text();
const schema = JSON.parse(html.match(/<script id="business-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
const configuredNumber = "5545999999999";

describe("WhatsApp configuration and links", () => {
  test("omits an unconfigured number and formats only valid recipients", () => {
    expect(["demo", "whatsapp"]).toContain(getContactMode(WHATSAPP_NUMBER));
    expect(getContactMode("")).toBe("demo");
    expect(createWhatsAppLink("")).toBeNull();
    expect(formatWhatsAppNumber("")).toBe("");
    expect(formatWhatsAppNumber("55DDXXXXXXXXX")).toBe("");
    expect(formatWhatsAppNumber(configuredNumber)).toBe("+55 (45) 99999-9999");
    expect(formatWhatsAppNumber("554533333333")).toBe("+55 (45) 3333-3333");
    expect(formatWhatsAppNumber("+55 invalid")).toBe("");
  });

  test("encodes every contextual message with a single URL builder", () => {
    for (const message of Object.values(whatsappMessages)) {
      const result = createWhatsAppLink(configuredNumber, message);
      const url = new URL(result);
      expect(url.origin).toBe("https://wa.me");
      expect(url.pathname).toBe("/" + configuredNumber);
      expect(url.searchParams.size).toBe(1);
      expect(url.searchParams.get("text")).toBe(message);
      expect(result).toContain(encodeURIComponent(message));
      expect(message).toContain(BUSINESS_NAME);
    }
  });

  test("never builds an external URL for an invalid configuration", () => {
    for (const number of [null, "", "55DDXXXXXXXXX", "123", "5545999999999?text=other", "+55 (45) 99999-9999"]) {
      expect(createWhatsAppLink(number)).toBeNull();
    }
  });

  test("provides contextual CTAs in every required section", () => {
    const links = [...html.matchAll(/<a\b[^>]*data-whatsapp="([^"]+)"[^>]*>/g)];
    expect(links.length).toBe(9);
    for (const [, context] of links) expect(Object.hasOwn(whatsappMessages, context)).toBe(true);
    for (const [link] of links) {
      expect(link).toMatch(/href="#(?:contato|contact-form)"/);
      expect(link).not.toContain('target="_blank"');
      expect(link).toContain('aria-label="');
    }
    for (const context of ["network", "support", "hardware", "other"]) {
      expect(Object.hasOwn(services, context)).toBe(true);
      expect(html).toContain('data-whatsapp="' + context + '"');
    }
    expect(html).toContain('class="button button-primary floating-whatsapp"');
  });
});

describe("Local identity and structured data", () => {
  test("uses a single page heading and consistent local metadata", () => {
    expect([...html.matchAll(/<h1\b/g)].length).toBe(1);
    expect(html).toContain('lang="pt-BR"');
    expect(html.match(/<title>(.*?)<\/title>/)[1]).toContain(BUSINESS_NAME);
    expect(schema.name).toBe(BUSINESS_NAME);
    expect(schema.address.addressLocality).toBe("Cascavel");
    expect(schema.address.addressRegion).toBe("PR");
    expect(schema.address.addressCountry).toBe("BR");
    expect(schema.openingHoursSpecification[0].dayOfWeek).toHaveLength(7);
    expect(schema.openingHoursSpecification[0].opens).toBe("00:00");
    expect(schema.openingHoursSpecification[0].closes).toBe("23:59");
    expect([...html.matchAll(/<details><summary>/g)].length).toBe(7);
    expect(html).not.toMatch(/TechNova|lorem ipsum|empresa fictícia/i);
  });

  test("omits unconfirmed personal and contact information", () => {
    const result = updateBusinessSchema(schema, "", businessDetails);
    expect(result.telephone).toBeUndefined();
    expect(result.contactPoint.url).toBeUndefined();
    expect(result.address.streetAddress).toBeUndefined();
    expect(result.address.postalCode).toBeUndefined();
    expect(result.email).toBeUndefined();
    expect(result.taxID).toBeUndefined();
    expect(result.sameAs).toBeUndefined();
    expect(result.areaServed).toEqual([{ "@type": "City", name: "Cascavel" }]);
    expect(html).not.toMatch(/\[PREENCHER:|lista de cobertura a confirmar/);
  });

  test("uses the configured number and verified details without mutating the source", () => {
    const details = { ...businessDetails, streetAddress: "Test street", postalCode: "00000-000", email: "test@example.test", cnpj: "TEST", socialLinks: ["https://example.test"], servedCities: ["Test city"] };
    const result = updateBusinessSchema(schema, configuredNumber, details);
    expect(result.telephone).toBe("+" + configuredNumber);
    expect(result.contactPoint.telephone).toBe(result.telephone);
    expect(result.contactPoint.url).toBe(createWhatsAppLink(configuredNumber));
    expect(result.address.streetAddress).toBe(details.streetAddress);
    expect(result.address.postalCode).toBe(details.postalCode);
    expect(result.areaServed.at(-1).name).toBe("Test city");
    expect(result.sameAs).toEqual(details.socialLinks);
    expect(result.email).toBe(details.email);
    expect(result.taxID).toBe(details.cnpj);
    expect(schema.address.streetAddress).toBeUndefined();
    expect(schema.areaServed).toHaveLength(1);
  });
});

test("preserves the approved identity and network-first positioning", async () => {
  const css = await Bun.file(new URL("../styles.css", import.meta.url)).text();
  for (const color of ["#315B83", "#6EACC2", "#4FC3C8", "#E7F0F3", "#183247", "#FFFFFF"]) expect(css).toContain(color);
  for (const font of ["inter", "manrope"]) {
    expect(css).toContain(font + "-latin-variable.woff2");
    expect(await Bun.file(new URL("../assets/fonts/" + font + "-latin-variable.woff2", import.meta.url)).exists()).toBe(true);
  }
  expect(html).toContain("datar-wordmark.svg");
  expect(html).toContain("datar-wordmark-com-descritor.svg");
  const favicon = await Bun.file(new URL("../favicon.svg", import.meta.url)).text();
  const official = await Bun.file(new URL("../brandig/datar/03_Icones_Digitais/datar-favicon.svg", import.meta.url)).text();
  expect(favicon.replace(/\r\n/g, "\n").trim()).toBe(official.replace(/\r\n/g, "\n").trim());
  expect(schema.slogan).toBe("Sua rede em ordem. Seu negócio em movimento.");
  expect(Object.keys(services)[0]).toBe("network");
  expect(html).not.toMatch(/certificad[oa]s?|hero-visual|core-illustration/i);
});
