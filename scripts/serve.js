import { resolve, sep } from "node:path";

const root = resolve(import.meta.dir, "..");
const port = Number(process.env.PORT || 3000);
const publicFiles = new Set(["/index.html", "/styles.css", "/favicon.svg"]);
const publicDirectories = [resolve(root, "assets"), resolve(root, "js")];

const server = Bun.serve({
  port,
  hostname: "0.0.0.0",
  async fetch(request) {
    if (!["GET", "HEAD"].includes(request.method)) {
      return new Response("Método não permitido", { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response("Endereço inválido", { status: 400 });
    }

    if (pathname === "/") pathname = "/index.html";
    const filePath = resolve(root, `.${pathname}`);
    const isPublic = publicFiles.has(pathname) || publicDirectories.some((directory) => filePath.startsWith(`${directory}${sep}`));

    if (!isPublic || !filePath.startsWith(`${root}${sep}`)) {
      return new Response("Página não encontrada", { status: 404 });
    }

    const file = Bun.file(filePath);
    if (!(await file.exists())) return new Response("Página não encontrada", { status: 404 });

    return new Response(request.method === "HEAD" ? null : file, {
      headers: {
        "Content-Type": file.type,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      }
    });
  }
});

console.info(`TechNova disponível em http://localhost:${server.port}`);
