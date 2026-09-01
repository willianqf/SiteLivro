import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const errors = [];
const ignoredDirectories = new Set([".git", "node_modules"]);

const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  if (ignoredDirectories.has(entry.name)) return [];
  const fullPath = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(fullPath) : [fullPath];
});

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
const relative = (file) => path.relative(root, file).replaceAll("\\", "/");
const report = (file, message) => errors.push(`${relative(file)}: ${message}`);

const localTarget = (file, rawUrl) => {
  const clean = rawUrl.split("#")[0].split("?")[0];
  if (!clean || /^(?:[a-z]+:|\/\/)/i.test(clean)) return null;
  const decoded = decodeURIComponent(clean);
  const candidate = decoded.startsWith("/")
    ? path.join(root, decoded.replace(/^\/+/, ""))
    : path.resolve(path.dirname(file), decoded);
  return decoded.endsWith("/") ? path.join(candidate, "index.html") : candidate;
};

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const isRedirect = /http-equiv=["']refresh["']/i.test(html);
  const isNoIndex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);
  const isEnglishPage = relative(file).startsWith("en/");
  const h1Count = (html.match(/<h1\b/gi) || []).length;

  if (!isRedirect && !isNoIndex && path.basename(file) !== "404.html" && h1Count !== 1) {
    report(file, `esperado 1 <h1>, encontrado ${h1Count}`);
  }

  if (!isRedirect && !isNoIndex && path.basename(file) !== "404.html") {
    if (!html.includes('class="language-switcher"') && !relative(file).includes("/previa/")) {
      report(file, "seletor de idioma ausente");
    }
    if (!html.includes('hreflang="pt-BR"') || !html.includes('hreflang="en"')) {
      report(file, "metadados hreflang incompletos");
    }
  }

  if (isEnglishPage) {
    if (!/<html\s+lang=["']en["']/i.test(html)) report(file, "página inglesa sem lang=en");
    for (const phrase of ["Pular para o conteúdo", "Navegação principal", "Loja UICLAP", "Escolha sua edição", "Privacidade e cookies"]) {
      if (html.includes(phrase)) report(file, `texto português residual: ${phrase}`);
    }
  }

  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
  for (const id of new Set(ids)) {
    if (ids.filter((value) => value === id).length > 1) report(file, `id duplicado: ${id}`);
  }

  for (const match of html.matchAll(/<(?:a|link|script|img|source)\b[^>]*\s(?:href|src)=["']([^"']+)["'][^>]*>/gi)) {
    const target = localTarget(file, match[1]);
    if (target && !fs.existsSync(target)) report(file, `recurso local ausente: ${match[1]}`);
  }

  for (const match of html.matchAll(/<a\b([^>]*)target=["']_blank["']([^>]*)>/gi)) {
    const attributes = `${match[1]} ${match[2]}`;
    if (!/rel=["'][^"']*noopener[^"']*noreferrer[^"']*["']/i.test(attributes)) {
      report(file, "link target=_blank sem rel=\"noopener noreferrer\"");
    }
  }

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      report(file, `JSON-LD inválido: ${error.message}`);
    }
  }

  if (/src=["'][^"']*(?:googletagmanager\.com|googlesyndication\.com)/i.test(html)) {
    report(file, "script de rastreamento carregado diretamente no HTML");
  }

}

const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const required of ["B0H4BVMK8Z", "B0HG5VPLBY", "B0HG62QBZC", "privacidade/"]) {
  if (!home.includes(required)) report(path.join(root, "index.html"), `conteúdo obrigatório ausente: ${required}`);
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const route of ["a-terra-dos-monstros/", "elemental/", "veter/", "trilhas/", "autor/", "privacidade/", "en/", "en/a-terra-dos-monstros/", "en/elemental/", "en/veter/", "en/soundtracks/", "en/author/", "en/privacy/"]) {
  if (!sitemap.includes(`https://willianquirino.com.br/${route}`)) {
    report(path.join(root, "sitemap.xml"), `rota ausente: ${route}`);
  }
}

if (errors.length) {
  console.error(`Falha na validação do site (${errors.length} problema(s)):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Site validado: ${htmlFiles.length} arquivos HTML, links locais, JSON-LD, privacidade e catálogo.`);
