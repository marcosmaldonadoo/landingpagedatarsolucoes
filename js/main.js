import { businessDetails, services, siteConfig } from "./config.js";
import { formatWhatsAppNumber, getContactAction, getContactMode, prepareContact, updateBusinessSchema, validateProject } from "./contact.js";

function setupNavigation() {
  const header = document.querySelector(".site-header");
  const navigation = document.querySelector("#site-navigation");
  const toggle = document.querySelector(".menu-toggle");
  const mobile = window.matchMedia("(max-width: 999px)");

  function setOpen(open, restoreFocus = false) {
    navigation.hidden = mobile.matches && !open;
    toggle.setAttribute("aria-expanded", String(mobile.matches && open));
    toggle.setAttribute("aria-label", open ? "Fechar menu de navegação" : "Abrir menu de navegação");
    if (restoreFocus) toggle.focus();
  }

  function updateLayout() {
    header.classList.toggle("mobile-navigation", mobile.matches);
    toggle.hidden = !mobile.matches;
    setOpen(false);
  }

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  mobile.addEventListener("change", updateLayout);

  navigation.addEventListener("click", (event) => {
    const link = event.target.closest("a[href^='#']");
    if (!link || !mobile.matches) return;
    setOpen(false);
    document.querySelector(link.getAttribute("href"))?.focus({ preventScroll: true });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });

  header.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !header.contains(event.relatedTarget)) setOpen(false);
  });

  updateLayout();
}

function setupContact() {
  const form = document.querySelector("#contact-form");
  const fields = {
    name: document.querySelector("#name"),
    service: document.querySelector("#service"),
    description: document.querySelector("#description")
  };
  const summary = document.querySelector("#form-errors");
  const summaryList = summary.querySelector("ul");
  const result = document.querySelector("#contact-result");
  const preview = document.querySelector("#message-preview");
  const whatsappLink = document.querySelector("#whatsapp-link");
  const status = document.querySelector("#form-status");
  const mode = getContactMode(siteConfig.whatsappNumber);
  let submitted = false;
  let renderedErrors = "";

  for (const [value, label] of Object.entries(services)) {
    fields.service.add(new Option(label, value));
  }

  if (mode === "whatsapp") {
    document.querySelector("#contact-mode").textContent = "Prévia antes do envio";
    document.querySelector(".form-description").textContent = "O formulário é opcional. Organize seu pedido, confira a mensagem e abra o WhatsApp para enviar.";
    document.querySelector("#demo-explanation").textContent = "Você decide quando enviar pelo WhatsApp.";
  }

  function readFields() {
    return Object.fromEntries(Object.entries(fields).map(([name, element]) => [name, element.value]));
  }

  function renderErrors(errors, focusSummary = false) {
    const nextErrors = JSON.stringify(errors);
    if (renderedErrors === nextErrors) {
      if (focusSummary && !summary.hidden) summary.focus();
      return;
    }
    renderedErrors = nextErrors;
    summaryList.replaceChildren();

    for (const [name, field] of Object.entries(fields)) {
      const message = errors[name];
      const error = document.querySelector(`#${name}-error`);
      field.setAttribute("aria-invalid", String(Boolean(message)));
      error.textContent = message || "";
      error.hidden = !message;

      if (message) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${name}`;
        link.textContent = message;
        link.addEventListener("click", (event) => {
          event.preventDefault();
          field.focus();
        });
        item.append(link);
        summaryList.append(item);
      }
    }

    summary.hidden = Object.keys(errors).length === 0;
    if (focusSummary && !summary.hidden) summary.focus();
  }

  function invalidatePreview() {
    if (!result.hidden) status.textContent = "Seus dados mudaram. Prepare a mensagem novamente para atualizar a prévia.";
    result.hidden = true;
    preview.value = "";
    whatsappLink.hidden = true;
    whatsappLink.removeAttribute("href");
  }

  function updateFields() {
    document.querySelector("#description-count").textContent = `${fields.description.value.length.toLocaleString("pt-BR")} / 1.500`;
    invalidatePreview();
    if (submitted) renderErrors(validateProject(readFields()).errors);
  }

  form.addEventListener("input", (event) => {
    if (Object.values(fields).includes(event.target)) updateFields();
  });
  fields.service.addEventListener("change", updateFields);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
    const contact = prepareContact(readFields(), siteConfig.whatsappNumber);
    renderErrors(contact.errors, true);
    if (!contact.valid) return;

    preview.value = contact.message;
    const explanation = document.querySelector("#result-explanation");
    status.textContent = "";

    if (contact.mode === "whatsapp") {
      explanation.textContent = "Confira o texto. O próximo botão abre outra aba; o envio é concluído por você no WhatsApp.";
      whatsappLink.href = contact.url;
      whatsappLink.hidden = false;
    } else {
      explanation.textContent = "Mensagem preparada para copiar. O contato com a Datar pelo site está indisponível no momento. Seu pedido não foi enviado.";
    }

    result.hidden = false;
    result.focus();
  });

  document.querySelector("#copy-message").addEventListener("click", async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(preview.value);
      status.textContent = "Mensagem copiada. Nenhuma mensagem foi enviada.";
    } catch {
      preview.focus();
      preview.select();
      status.textContent = "A cópia automática não está disponível. A mensagem foi selecionada; use a opção Copiar do seu dispositivo.";
    }
  });

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.dataset.service) {
        fields.service.value = link.dataset.service;
        updateFields();
      }
      if (link.getAttribute("href") === "#contact-form") form.focus({ preventScroll: true });
    });
  });

  form.noValidate = true;
  document.querySelector("#contact-fields").disabled = false;
}

function setupPrivacyLink() {
  document.querySelectorAll("a[href='#privacidade']").forEach((link) => {
    link.addEventListener("click", () => {
      const details = document.querySelector("#privacidade");
      details.open = true;
      details.querySelector("summary").focus({ preventScroll: true });
    });
  });
}

export function setupWhatsApp(number = siteConfig.whatsappNumber) {
  const available = getContactMode(number) === "whatsapp";
  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    const action = getContactAction(number, link.dataset.whatsapp);
    link.href = action.href;
    link.querySelector("[data-cta-label]").textContent = action.label;
    link.setAttribute("aria-label", action.ariaLabel);
    if (action.service) link.dataset.service = action.service;
    else delete link.dataset.service;
    if (action.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.removeAttribute("aria-describedby");
    } else {
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.setAttribute("aria-describedby", "whatsapp-availability");
    }
  });
  document.querySelectorAll("[data-whatsapp-number]").forEach(element => {
    element.textContent = formatWhatsAppNumber(number);
    element.parentElement.hidden = !available;
  });
  document.querySelectorAll("[data-contact-availability]").forEach(element => { element.hidden = available; });
  document.querySelector(".hero-note").hidden = !available;
}

function setupFloatingContact() {
  const floating = document.querySelector(".floating-whatsapp");
  if (!("IntersectionObserver" in window)) return;
  const visibleSections = new Set();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    }
    floating.hidden = visibleSections.size > 0;
  }, { rootMargin: "0px 0px 100px 0px" });
  observer.observe(document.querySelector("#inicio"));
  observer.observe(document.querySelector("#contato"));
  observer.observe(document.querySelector(".site-footer"));
}

function setupBusinessDetails() {
  const cities = document.querySelector("#served-cities");
  if (businessDetails.servedCities.length) {
    cities.hidden = false;
    cities.replaceChildren(...businessDetails.servedCities.map(city => {
      const item = document.createElement("li");
      item.textContent = city;
      return item;
    }));
  }
  if (businessDetails.certifications.length) {
    const certifications = document.querySelector("[data-certifications]");
    certifications.textContent = `Certificações: ${businessDetails.certifications.join(", ")}.`;
    certifications.hidden = false;
  }
  const details = [businessDetails.streetAddress, businessDetails.postalCode, businessDetails.cnpj && `CNPJ: ${businessDetails.cnpj}`, businessDetails.email].filter(Boolean);
  if (details.length) {
    const element = document.querySelector("[data-business-details]");
    element.textContent = details.join(" · ");
    element.hidden = false;
  }
  const schema = document.querySelector("#business-schema");
  schema.textContent = JSON.stringify(updateBusinessSchema(JSON.parse(schema.textContent), siteConfig.whatsappNumber, businessDetails));
}

setupNavigation();
setupWhatsApp();
setupBusinessDetails();
setupContact();
setupFloatingContact();
setupPrivacyLink();
document.querySelector("#current-year").textContent = String(new Date().getFullYear());
