"use strict";

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const themeToggle = document.querySelector("[data-theme-toggle]");
if (themeToggle) {
  const isDark = () => document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === "dark"
    : systemTheme.matches;

  function reflectTheme() {
    themeToggle.setAttribute("aria-pressed", String(isDark()));
  }

  themeToggle.hidden = false;
  reflectTheme();
  themeToggle.addEventListener("click", () => {
    document.documentElement.dataset.theme = isDark() ? "light" : "dark";
    reflectTheme();
  });
  systemTheme.addEventListener("change", reflectTheme);
}

const query = new URLSearchParams(window.location.search);
const headlineOptions = {
  a: ["Suporte de TI para sua ", "loja e sua casa."],
  b: ["Quando a tecnologia atrapalha, ", "a Datar ajuda."],
};
const headline = document.querySelector("#headline");
const headlineOption = query.get("headline");
if (headline && Object.hasOwn(headlineOptions, headlineOption)) {
  const [beginning, ending] = headlineOptions[headlineOption];
  const accent = document.createElement("span");
  accent.textContent = ending;
  headline.replaceChildren(beginning, accent);
}

const messages = {
  loja: "Olá, Datar! Preciso de ajuda com a tecnologia da minha loja. Minha cidade ou bairro é: ___. O que está acontecendo: ___.",
  casa: "Olá, Datar! Preciso de suporte técnico em casa. Minha cidade ou bairro é: ___. O problema começou quando: ___.",
  urgencia: "Olá, Datar! Tenho uma situação urgente. O que parou de funcionar: ___. O impacto na rotina é: ___. Minha cidade ou bairro é: ___.",
};
const choice = document.querySelector("[data-contact-choice]");
const links = [...document.querySelectorAll("a[data-whatsapp]")];

if (choice && links.length) {
  const selected = () => choice.querySelector("input:checked").value;
  const contextFor = link => link.dataset.contactContext || selected();

  function setContactUrls() {
    for (const link of links) {
      const url = new URL(link.href);
      url.searchParams.set("text", messages[contextFor(link)]);
      link.href = url.toString();
    }
  }

  const tracking = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const value = (query.get(key) || "").toLowerCase();
    if (/^[a-z0-9_-]{1,50}$/.test(value)) tracking[key] = value;
  }

  window.dataLayer = window.dataLayer || [];
  for (const link of links) {
    link.addEventListener("click", () => {
      const context = contextFor(link);
      if (link.dataset.contactContext) {
        const input = [...choice.querySelectorAll("input")].find(item => item.value === context);
        input.checked = true;
        setContactUrls();
      }
      window.dataLayer.push({
        event: "whatsapp_click",
        cta_position: link.dataset.whatsapp,
        contact_context: context,
        ...tracking,
      });
    });
  }

  choice.hidden = false;
  choice.addEventListener("change", setContactUrls);
  setContactUrls();
}
