import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(toolsDir, "..");
const domain = "https://willianquirino.com.br";
const source = fs.readFileSync(path.join(root, "assets", "preview-data.js"), "utf8");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(source, context);
const previews = context.window.BOOK_PREVIEWS;

const books = {
  terra: {
    slug: "a-terra-dos-monstros",
    title: "A Terra dos Monstros",
    eyebrow: "Fantasia sombria e distopia",
    description: "Em Avoltera, Melina precisa atravessar os limites das cidades-fortaleza e descobrir verdades mais perigosas do que os monstros.",
    hook: "Quando as muralhas deixam de ser proteção, o mundo do lado de fora deixa de ser a única ameaça.",
    pages: 458,
    cover: "cover-terra.jpg",
    hero: "terra-braen.jpg",
    gallery: ["terra-invasao.jpg", "terra-fera.jpg", "terra-braen.jpg"],
    themes: ["Sobrevivência", "Fantasia sombria", "Mistério"],
    buyUrl: "https://loja.uiclap.com/titulo/ua145914",
    spotify: "https://open.spotify.com/album/6ZWQOwftjpiECe2zX6UdA5",
    spotifyEmbed: "https://open.spotify.com/embed/album/6ZWQOwftjpiECe2zX6UdA5?utm_source=generator&theme=0",
    accent: "terra",
  },
  elemental: {
    slug: "elemental",
    title: "As Histórias de Mentel: Elemental",
    shortTitle: "Elemental",
    eyebrow: "Ficção científica e aventura",
    description: "O último herdeiro de Mendels cai no sertão de Pernambuco enquanto uma guerra atravessa as estrelas.",
    hook: "Uma linhagem perdida. Uma guerra interestelar. Um encontro improvável no sertão.",
    pages: 258,
    cover: "cover-elemental.jpg",
    hero: "elemental-retorno.jpg",
    gallery: ["elemental-fenda.jpg", "elemental-retorno.jpg", "elemental-arte.jpg"],
    themes: ["Space opera", "Caatinga", "Legado"],
    buyUrl: "https://loja.uiclap.com/titulo/ua151952",
    accent: "elemental",
  },
  veter: {
    slug: "veter",
    title: "Veter",
    eyebrow: "Distopia e super-humano",
    description: "Um entregador sem perspectivas aceita uma cura impossível e desperta transformado em algo imprevisível.",
    hook: "A cura devolveu seus movimentos. O experimento tirou sua antiga humanidade.",
    pages: 308,
    cover: "cover-veter.jpg",
    hero: "veter-emergindo.jpg",
    gallery: ["veter-emergindo.jpg", "veter-templo.jpg", "veter-fera.jpg"],
    themes: ["Conspiração", "Biotecnologia", "Anti-herói"],
    buyUrl: "https://loja.uiclap.com/titulo/ua152387",
    spotify: "https://open.spotify.com/album/4aqvhBNZdb1g7GXYm2HLyO",
    spotifyEmbed: "https://open.spotify.com/embed/album/4aqvhBNZdb1g7GXYm2HLyO?utm_source=generator&theme=0",
    accent: "veter",
  },
};

const escapeHtml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const webp = (value) => value.replace(/\.jpg$/i, ".webp");

const imageWidths = {
  "elemental-arte.jpg": 1448,
  "elemental-fenda.jpg": 1122,
  "elemental-retorno.jpg": 1448,
  "terra-braen.jpg": 1448,
  "terra-fera.jpg": 1536,
  "terra-invasao.jpg": 1448,
  "veter-emergindo.jpg": 1500,
  "veter-fera.jpg": 1500,
  "veter-templo.jpg": 1024,
};

const responsiveImage = (file, alt) => {
  const base = webp(file).replace(/\.webp$/i, "");
  return `<img src="../assets/images/${base}.webp" srcset="../assets/images/${base}-640.webp 640w, ../assets/images/${base}-960.webp 960w, ../assets/images/${base}.webp ${imageWidths[file]}w" sizes="(max-width: 700px) calc(100vw - 30px), (max-width: 980px) 50vw, 38vw" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
};

const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data)}</script>`;

const head = ({ title, description, canonical, image, structuredData, css = "../assets/styles.css", favicon = "../assets/favicon.svg" }) => `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#071014">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Willian Quirino">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${image}">
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="${favicon}" type="image/svg+xml">
  <link rel="stylesheet" href="${css}">
  ${structuredData.map(jsonLd).join("\n  ")}`;

const header = (prefix = "../") => `
  <header class="site-header is-scrolled page-header" data-header>
    <a class="brand" href="${prefix}" aria-label="Willian Quirino, início">
      <span class="brand-mark" aria-hidden="true">WQ</span>
      <span class="brand-copy"><strong>Willian Quirino</strong><small>Autor</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle>
      <span></span><span></span><span></span><span class="sr-only">Abrir menu</span>
    </button>
    <nav class="site-nav" id="site-nav" aria-label="Navegação principal" data-nav>
      <a href="${prefix}#livros">Livros</a>
      <a href="${prefix}trilhas/">Trilhas</a>
      <a href="${prefix}autor/">O autor</a>
      <a class="nav-cta" href="https://loja.uiclap.com/pesquisa=Willian%20Quirino" target="_blank" rel="noopener noreferrer">Loja UICLAP</a>
    </nav>
  </header>`;

const footer = (prefix = "../") => `
  <footer class="site-footer">
    <div class="container footer-layout">
      <div>
        <a class="brand footer-brand" href="${prefix}">
          <span class="brand-mark" aria-hidden="true">WQ</span>
          <span class="brand-copy"><strong>Willian Quirino</strong><small>Histórias de Mentel</small></span>
        </a>
        <p>Ficção, fantasia e mundos ilustrados.</p>
      </div>
      <nav aria-label="Links do rodapé">
        <a href="${prefix}#livros">Livros</a>
        <a href="${prefix}trilhas/">Trilhas</a>
        <a href="${prefix}autor/">Autor</a>
        <a href="https://loja.uiclap.com/pesquisa=Willian%20Quirino" target="_blank" rel="noopener noreferrer">UICLAP</a>
      </nav>
      <p class="copyright">© <span data-year></span> Willian Quirino.</p>
    </div>
  </footer>
  <script src="${prefix}assets/script.js"></script>`;

const breadcrumbs = (items) => jsonLd({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

const bookPage = (key, book) => {
  const preview = previews[key];
  const canonical = `${domain}/${book.slug}/`;
  const displayTitle = book.shortTitle || book.title;
  const image = `${domain}/assets/images/${book.cover}`;
  const structuredData = [{
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    author: { "@type": "Person", name: "Willian Quirino", url: `${domain}/autor/` },
    description: book.description,
    image,
    inLanguage: "pt-BR",
    numberOfPages: book.pages,
    bookFormat: "https://schema.org/Paperback",
    url: canonical,
  }];

  const soundtrack = book.spotifyEmbed ? `
      <section class="detail-soundtrack reveal" aria-labelledby="soundtrack-title">
        <div>
          <p class="eyebrow">Ouça antes de entrar nesse mundo</p>
          <h2 id="soundtrack-title">Trilha sonora original</h2>
          <p>A música amplia a atmosfera da história e acompanha o universo para além das páginas.</p>
          <a class="text-link" href="${book.spotify}" target="_blank" rel="noopener noreferrer">Abrir álbum no Spotify <span aria-hidden="true">↗</span></a>
        </div>
        <iframe class="spotify-player" src="${book.spotifyEmbed}" title="Trilha sonora de ${displayTitle} no Spotify" width="100%" height="352" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
      </section>` : "";

  return `<!doctype html>
<html lang="pt-BR">
<head>
${head({
  title: `${displayTitle} | Livro de Willian Quirino`,
  description: book.description,
  canonical,
  image,
  structuredData,
})}
  <script>document.documentElement.classList.add("js");</script>
</head>
<body class="detail-page detail-${book.accent}">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
${header()}
  <main id="conteudo">
    <section class="detail-hero">
      <div class="detail-hero-art" style="background-image:url('../assets/images/${webp(book.hero)}')" aria-hidden="true"></div>
      <div class="container detail-hero-layout">
        <div class="detail-cover reveal">
          <img src="../assets/images/${webp(book.cover)}" alt="Capa de ${book.title}" width="555" height="800">
        </div>
        <div class="detail-intro reveal">
          <p class="eyebrow">${book.eyebrow}</p>
          <h1>${displayTitle}</h1>
          <p class="detail-hook">${book.hook}</p>
          <p>${book.description}</p>
          <ul class="book-meta" aria-label="Informações do livro">
            <li>${book.pages} páginas</li><li>Edição ilustrada</li><li>Português</li>
          </ul>
          <div class="feature-actions">
            <a class="button button-preview" href="previa/">Leia o primeiro capítulo grátis <span aria-hidden="true">→</span></a>
            <a class="button button-${book.accent}" href="${book.buyUrl}" target="_blank" rel="noopener noreferrer">Comprar edição ilustrada <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
    </section>

    <section class="section detail-story">
      <div class="container detail-story-grid">
        <div class="reveal">
          <p class="eyebrow">Entre neste universo</p>
          <h2>Uma história sobre ${book.themes.map((theme) => theme.toLowerCase()).join(", ")}</h2>
        </div>
        <div class="detail-story-copy reveal">
          <p>${book.description}</p>
          <p>A edição reúne narrativa e ilustrações para transformar momentos centrais da jornada em uma experiência visual.</p>
          <a class="preview-link" href="previa/">Começar a leitura gratuita <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div class="container detail-gallery">
        ${book.gallery.map((file, index) => responsiveImage(file, `Ilustração ${index + 1} do universo de ${displayTitle}`)).join("\n        ")}
      </div>
    </section>

    ${soundtrack}

    <section class="detail-cta">
      <div class="container reveal">
        <p class="eyebrow">A história continua</p>
        <h2>Descubra o que existe depois do primeiro capítulo.</h2>
        <div class="feature-actions">
          <a class="button button-preview" href="previa/">Ler capítulo grátis</a>
          <a class="button button-${book.accent}" href="${book.buyUrl}" target="_blank" rel="noopener noreferrer">Adquirir ${displayTitle}</a>
        </div>
      </div>
    </section>
  </main>
${footer()}
${breadcrumbs([
  { name: "Início", url: `${domain}/` },
  { name: displayTitle, url: canonical },
])}
</body>
</html>`;
};

const paragraphHtml = (paragraph) => {
  const text = escapeHtml(paragraph.text.trim());
  if (text === "***") return '<hr class="chapter-divider">';
  const heading = (paragraph.style || "").toLowerCase().includes("heading");
  return heading ? `<h2>${text}</h2>` : `<p>${text}</p>`;
};

const previewPage = (key, book) => {
  const preview = previews[key];
  const canonical = `${domain}/${book.slug}/previa/`;
  const displayTitle = book.shortTitle || book.title;
  const image = `${domain}/assets/images/${book.cover}`;
  const audio = key === "terra" ? `
    <section class="reader-audio" data-reader-audio aria-label="Audiobook do primeiro capítulo">
      <div class="reader-audio-heading"><span class="reader-audio-eyebrow">Audiobook exclusivo</span><strong data-audio-title>Um dia de cada vez</strong><small>Narração completa para acompanhar a leitura</small></div>
      <button class="reader-audio-play" type="button" data-audio-play aria-label="Reproduzir audiobook"><span data-audio-play-icon aria-hidden="true">▶</span></button>
      <div class="reader-audio-timeline"><input type="range" min="0" max="100" value="0" step="0.1" data-audio-progress aria-label="Posição do audiobook"><div class="reader-audio-time"><span data-audio-current>0:00</span><span data-audio-duration>25:55</span></div></div>
      <button class="reader-audio-speed" type="button" data-audio-speed aria-label="Velocidade de reprodução">1×</button>
      <audio data-audio-element preload="none"></audio>
    </section>` : `<section class="reader-audio" data-reader-audio hidden></section>`;

  return `<!doctype html>
<html lang="pt-BR">
<head>
${head({
  title: `${preview.chapterTitle} | Prévia de ${displayTitle}`,
  description: `Leia gratuitamente ${preview.chapterTitle}, uma prévia do livro ${book.title}, de Willian Quirino.`,
  canonical,
  image,
  css: "../../assets/reader.css",
  favicon: "../../assets/favicon.svg",
  structuredData: [{
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${preview.chapterTitle} — ${book.title}`,
    isPartOf: { "@type": "Book", name: book.title, url: `${domain}/${book.slug}/` },
    author: { "@type": "Person", name: "Willian Quirino", url: `${domain}/autor/` },
    inLanguage: "pt-BR",
    url: canonical,
  }],
})}
  <script>document.documentElement.classList.add("js");</script>
</head>
<body class="reader-body theme-${preview.theme}" data-book="${key}" data-base="../../" data-return="../">
  <div class="reader-backdrop" data-reader-backdrop style="background-image:url('../../${webp(preview.art)}')" aria-hidden="true"></div>
  <header class="reader-header">
    <a class="reader-back-link" href="../"><span aria-hidden="true">←</span> Voltar ao livro</a>
    <div class="reader-book-name"><span>Prévia gratuita</span><strong data-reader-title>${book.title}</strong></div>
    <a class="reader-buy-link" data-reader-buy href="${book.buyUrl}" target="_blank" rel="noopener noreferrer">Comprar edição <span aria-hidden="true">↗</span></a>
  </header>
  <main class="reader-main">
    <section class="reader-intro" aria-labelledby="reader-heading">
      <p data-reader-label>${preview.chapterLabel}</p>
      <h1 id="reader-heading" data-reader-heading>${preview.chapterTitle}</h1>
      <span data-reader-word-count>${preview.wordCount.toLocaleString("pt-BR")} palavras nesta prévia</span>
    </section>
    ${audio}
    <section class="reader-interactive" aria-label="Leitor animado">
      <div class="reader-stage" data-reader-stage aria-live="polite">
        <div class="reader-book" data-reader-book>
          <article class="reader-page reader-page-left" data-reader-page-left></article>
          <div class="reader-spine" aria-hidden="true"></div>
          <article class="reader-page reader-page-right" data-reader-page-right></article>
          <div class="reader-turn" data-reader-turn aria-hidden="true">
            <article class="reader-page reader-turn-face reader-turn-front" data-reader-turn-front></article>
            <article class="reader-page reader-turn-face reader-turn-back" data-reader-turn-back></article>
          </div>
        </div>
        <div class="reader-measure" data-reader-measure aria-hidden="true"></div>
      </div>
      <div class="reader-controls">
        <button class="reader-control" type="button" data-reader-prev aria-label="Página anterior"><span aria-hidden="true">←</span><span>Anterior</span></button>
        <div class="reader-progress"><span data-reader-page-label>Página 1</span><div class="reader-progress-track" aria-hidden="true"><span data-reader-progress></span></div><small>Arraste a página ou use as setas do teclado</small></div>
        <button class="reader-control" type="button" data-reader-next aria-label="Próxima página"><span>Próxima</span><span aria-hidden="true">→</span></button>
      </div>
    </section>

    <article class="chapter-transcript" aria-labelledby="transcript-title">
      <div class="chapter-transcript-heading">
        <p>Modo texto</p>
        <h2 id="transcript-title">${preview.chapterTitle}</h2>
        <span>O primeiro capítulo também está disponível abaixo em formato acessível e indexável.</span>
      </div>
      <div class="chapter-transcript-copy">
        ${preview.paragraphs.map(paragraphHtml).join("\n        ")}
      </div>
      <aside class="chapter-purchase">
        <p>A história continua no livro completo.</p>
        <a href="${book.buyUrl}" target="_blank" rel="noopener noreferrer">Adquirir ${displayTitle} na UICLAP <span aria-hidden="true">↗</span></a>
        <a href="../">Voltar à página do livro</a>
      </aside>
    </article>
  </main>
  <script src="../../assets/preview-data.js"></script>
  <script src="../../assets/reader.js"></script>
</body>
</html>`;
};

const simplePage = ({ slug, title, description, image, body, structuredData = [] }) => {
  const canonical = `${domain}/${slug}/`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
${head({ title, description, canonical, image, structuredData })}
  <script>document.documentElement.classList.add("js");</script>
</head>
<body class="detail-page">
  <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
${header()}
  <main id="conteudo">${body}</main>
${footer()}
${breadcrumbs([{ name: "Início", url: `${domain}/` }, { name: title.split(" | ")[0], url: canonical }])}
</body>
</html>`;
};

const authorPage = simplePage({
  slug: "autor",
  title: "Willian Quirino | Autor das Histórias de Mentel",
  description: "Conheça Willian Quirino, autor de Elemental, A Terra dos Monstros e Veter, e o processo de criação das Histórias de Mentel.",
  image: `${domain}/assets/images/autor-willian.jpg`,
  structuredData: [{
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Willian Quirino",
    url: `${domain}/autor/`,
    image: `${domain}/assets/images/autor-willian.jpg`,
    jobTitle: "Autor e compositor",
  }],
  body: `
    <section class="profile-hero section">
      <div class="container author-layout">
        <div class="author-portrait reveal"><div class="portrait-frame"><img src="../assets/images/autor-willian.webp" alt="Retrato em preto e branco de Willian Quirino" width="512" height="512"></div><p class="portrait-signature">Willian Quirino</p></div>
        <div class="author-copy reveal"><p class="eyebrow">Autor e criador</p><h1>Imaginar foi o começo.<br>Persistir fez o universo crescer.</h1>
          <p>Willian Quirino é o criador das <strong>Histórias de Mentel</strong>, um universo que reúne ficção científica, fantasia, mundos distantes e personagens em transformação.</p>
          <p>A primeira ideia de <em>Elemental</em> nasceu em 2006, quando o autor tinha dez anos. Depois de uma longa pausa provocada por um problema de saúde em 2012, ele retomou a escrita e transformou aquele projeto de infância em uma série de livros publicados.</p>
          <p>Suas obras combinam narrativa, ilustrações e trilhas sonoras para criar uma leitura imersiva, conectando diferentes histórias dentro de um mesmo universo em expansão.</p>
          <div class="feature-actions"><a class="button button-primary" href="../#livros">Conhecer os livros</a><a class="button button-ghost" href="../trilhas/">Ouvir as trilhas</a></div>
        </div>
      </div>
    </section>`,
});

const musicCards = Object.values(books).filter((book) => book.spotify).map((book) => `
  <article class="soundtrack-card soundtrack-${book.accent} reveal">
    <div class="soundtrack-card-head"><img src="../assets/images/${webp(book.cover)}" alt="Capa de ${book.title}" width="555" height="800" loading="lazy" decoding="async"><div><p class="soundtrack-label"><span></span> Trilha sonora original</p><h2>${book.shortTitle || book.title}</h2><p>Uma paisagem sonora composta para acompanhar este universo.</p></div></div>
    <iframe class="spotify-player" src="${book.spotifyEmbed}" title="Trilha sonora de ${book.title} no Spotify" width="100%" height="352" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
    <a class="spotify-link" href="${book.spotify}" target="_blank" rel="noopener noreferrer">Ouvir no Spotify <span aria-hidden="true">↗</span></a>
  </article>`).join("");

const musicPage = simplePage({
  slug: "trilhas",
  title: "Trilhas e músicas do universo | Willian Quirino",
  description: "Ouça as trilhas sonoras de A Terra dos Monstros e Veter, compostas para expandir os universos literários de Willian Quirino.",
  image: `${domain}/assets/images/hero.jpg`,
  structuredData: Object.values(books).filter((book) => book.spotify).map((book) => ({
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: `${book.title} — Trilha sonora original`,
    byArtist: { "@type": "Person", name: "Willian Quirino" },
    url: book.spotify,
    image: `${domain}/assets/images/${book.cover}`,
  })),
  body: `
    <section class="page-hero section"><div class="container"><p class="eyebrow reveal">Mundos para ler e ouvir</p><h1 class="reveal">Trilhas e músicas do universo</h1><p class="reveal">Compostas para acompanhar cada atmosfera, as trilhas levam as histórias para além das páginas.</p></div></section>
    <section class="section soundtracks-section"><div class="container"><div class="soundtrack-grid">${musicCards}</div><div class="platform-note reveal"><h2>Mais lançamentos</h2><p>Novas músicas e histórias sonoras serão reunidas aqui conforme o universo continuar crescendo.</p></div></div></section>`,
});

for (const [key, book] of Object.entries(books)) {
  const directory = path.join(root, book.slug);
  const previewDirectory = path.join(directory, "previa");
  fs.mkdirSync(previewDirectory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), bookPage(key, book), "utf8");
  fs.writeFileSync(path.join(previewDirectory, "index.html"), previewPage(key, book), "utf8");
}

fs.mkdirSync(path.join(root, "autor"), { recursive: true });
fs.mkdirSync(path.join(root, "trilhas"), { recursive: true });
fs.writeFileSync(path.join(root, "autor", "index.html"), authorPage, "utf8");
fs.writeFileSync(path.join(root, "trilhas", "index.html"), musicPage, "utf8");

console.log("Páginas estáticas geradas com sucesso.");
