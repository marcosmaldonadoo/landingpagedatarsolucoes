import { resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const html = await Bun.file(resolve(root, "index.html")).text();
const errors = [];
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);

if (new Set(ids).size !== ids.length) errors.push("Há IDs duplicados no HTML.");
for (const match of html.matchAll(/\bhref="#([^"]+)"/g)) {
  if (!ids.includes(match[1])) errors.push(`Âncora sem destino: #${match[1]}`);
}
for (const match of html.matchAll(/(?:\bsrc|\bhref)="\.\/([^"]+)"/g)) {
  if (!(await Bun.file(resolve(root, match[1])).exists())) errors.push(`Asset local ausente: ${match[1]}`);
}

const build = await Bun.build({
  entrypoints: [resolve(root, "js/main.js")],
  target: "browser",
  write: false,
  minify: true
});
if (!build.success) errors.push(...build.logs.map(String));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.info("OK: JavaScript compilado para navegador; imports, assets e âncoras locais verificados.");
  console.info("Este check não substitui um linter ou uma auditoria completa de acessibilidade.");
}
