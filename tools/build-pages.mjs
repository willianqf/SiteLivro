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
    soundtrackDescription: "Uma trilha sombria, atmosférica e tensa, criada para acompanhar a vida dentro das muralhas e o medo que atravessa a floresta.",
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
    soundtrackDescription: "Uma trilha urbana, distópica e emocional, conduzida por transformação, perda e uma força que já não pode ser controlada.",
    accent: "veter",
  },
};

const musicReleases = [
  {
    title: "Terra dos Monstros (Trilha Sonora Original)",
    displayTitle: "A Terra dos Monstros",
    type: "Álbum",
    date: "2025-11-05",
    year: "2025",
    tracks: 13,
    artwork: "terra-original.webp",
    apple: "https://music.apple.com/br/album/terra-dos-monstros-trilha-sonora-original/1851644783",
    description: "A primeira travessia musical por Braen: rotina, tensão e os perigos que permanecem além das muralhas.",
  },
  {
    title: "Veter",
    displayTitle: "Veter",
    type: "Álbum",
    date: "2025-11-14",
    year: "2025",
    tracks: 14,
    artwork: "veter-album.webp",
    apple: "https://music.apple.com/br/album/veter/1852639835",
    description: "Uma jornada urbana e distópica que acompanha Veter entre perdas, escolhas e confrontos.",
  },
  {
    title: "A Terra dos Monstros, Vol. 2",
    displayTitle: "A Terra dos Monstros, Vol. 2",
    type: "Álbum",
    date: "2026-01-20",
    year: "2026",
    tracks: 13,
    artwork: "terra-vol2.webp",
    apple: "https://music.apple.com/br/album/a-terra-dos-monstros-vol-2/1869027901",
    description: "O universo se expande com novas sombras, ameaças ocultas e caminhos pela floresta.",
  },
  {
    title: "Veter (Trilha Sonora Original) - EP",
    displayTitle: "Veter: Trilha Sonora Original",
    type: "EP",
    date: "2026-03-09",
    year: "2026",
    tracks: 6,
    artwork: "veter-ep.webp",
    apple: "https://music.apple.com/br/album/veter-trilha-sonora-original-ep/1884095488",
    description: "Seis faixas sobre memória, afeto e a identidade que resiste à transformação.",
  },
  {
    title: "O Fim de uma História",
    displayTitle: "O Fim de uma História",
    type: "Single",
    date: "2026-04-06",
    year: "2026",
    tracks: 1,
    artwork: "fim-historia.webp",
    apple: "https://music.apple.com/br/album/o-fim-de-uma-hist%C3%B3ria-single/1892286733",
    description: "Um encerramento musical marcado por despedida, lembrança e permanência.",
  },
  {
    title: "O Caminho para a Floresta",
    displayTitle: "O Caminho para a Floresta",
    type: "Single",
    date: "2026-04-20",
    year: "2026",
    tracks: 1,
    artwork: "caminho-floresta.webp",
    apple: "https://music.apple.com/br/album/o-caminho-para-a-floresta-single/1895181109",
    description: "Uma passagem sonora rumo ao desconhecido que existe além da proteção das muralhas.",
  },
  {
    title: "Uma Carta de Esperança",
    displayTitle: "Uma Carta de Esperança",
    type: "Single",
    date: "2026-05-26",
    year: "2026",
    tracks: 1,
    artwork: "carta-esperanca.webp",
    apple: "https://music.apple.com/br/album/uma-carta-de-esperan%C3%A7a-single/6774201319",
    description: "Uma composição ligada ao universo de Veter sobre resistência, memória e esperança.",
  },
];

const appleArtist = "https://music.apple.com/br/artist/willian-quirino/1851075950";
const youtubeMusicArtistSearch = "https://music.youtube.com/search?q=Willian%20Quirino";
const shazamArtistSearch = "https://www.shazam.com/search/Willian%20Quirino";

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

const head = ({ title, description, canonical, image, structuredData, css = "../assets/styles.css?v=20260614-4", favicon = "../assets/favicon.svg" }) => `
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
  <meta property="og:image:alt" content="${escapeHtml(title)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${escapeHtml(title)}">
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
  <script src="${prefix}assets/script.js?v=20260614-3"></script>`;

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
  const previewAction = key === "elemental" ? "Leia trechos grátis" : "Leia o primeiro capítulo grátis";
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
          <p>${book.soundtrackDescription}</p>
          <a class="text-link" href="${book.spotify}" target="_blank" rel="noopener noreferrer">Abrir álbum no Spotify <span aria-hidden="true">↗</span></a>
        </div>
        <iframe class="spotify-player" src="${book.spotifyEmbed}" title="Trilha sonora de ${displayTitle} no Spotify" width="100%" height="352" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
      </section>` : "";
  const cover = key === "terra" ? `<div class="book-3d-shell" data-book-3d>
            <div class="book-3d-scene" role="img" tabindex="0" aria-label="Modelo tridimensional do livro A Terra dos Monstros. Arraste para girar." data-book-3d-scene>
              <div class="book-3d" data-book-3d-model>
                <div class="book-3d-face book-3d-front">
                  <img src="../assets/images/book-3d/terra-front.webp" alt="Capa de A Terra dos Monstros" width="900" height="1273" draggable="false">
                </div>
                <div class="book-3d-face book-3d-back">
                  <img src="../assets/images/book-3d/terra-back.webp" alt="" width="900" height="1273" draggable="false">
                </div>
                <div class="book-3d-face book-3d-spine">
                  <img src="../assets/images/book-3d/terra-spine.webp" alt="" width="128" height="1280" draggable="false">
                </div>
                <div class="book-3d-face book-3d-pages book-3d-page-edge" aria-hidden="true"></div>
                <div class="book-3d-face book-3d-pages book-3d-page-top" aria-hidden="true"></div>
                <div class="book-3d-face book-3d-pages book-3d-page-bottom" aria-hidden="true"></div>
              </div>
            </div>
            <div class="book-3d-controls">
              <span>Arraste para girar</span>
              <button type="button" data-book-3d-reset aria-label="Voltar o livro para a posição inicial">Reposicionar</button>
            </div>
          </div>` : `<img src="../assets/images/${webp(book.cover)}" alt="Capa de ${book.title}" width="555" height="800">`;

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
          ${cover}
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
            <a class="button button-preview" href="previa/">${previewAction} <span aria-hidden="true">→</span></a>
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
          <a class="preview-link" href="previa/">${key === "elemental" ? "Ler os trechos selecionados" : "Começar a leitura gratuita"} <span aria-hidden="true">→</span></a>
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
          <a class="button button-preview" href="previa/">${key === "elemental" ? "Ler trechos grátis" : "Ler capítulo grátis"}</a>
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
  const isSelectedScenes = key === "elemental";
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
  description: isSelectedScenes
    ? `Leia gratuitamente trechos selecionados de ${book.title}, de Willian Quirino.`
    : `Leia gratuitamente ${preview.chapterTitle}, uma prévia do livro ${book.title}, de Willian Quirino.`,
  canonical,
  image,
  css: "../../assets/reader.css?v=20260614-2",
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

    <details class="chapter-transcript">
      <summary>
        <span>Leitura alternativa</span>
        <strong>${isSelectedScenes ? "Ler os trechos em modo texto" : "Ler o capítulo em modo texto"}</strong>
        <small>Abra somente se preferir a leitura contínua, sem animação de páginas.</small>
      </summary>
      <article class="chapter-transcript-content" aria-labelledby="transcript-title">
        <div class="chapter-transcript-heading">
          <p>Modo texto</p>
          <h2 id="transcript-title">${preview.chapterTitle}</h2>
          <span>${isSelectedScenes
            ? "Trechos selecionados disponíveis em formato acessível e indexável."
            : "Versão acessível do mesmo capítulo apresentado no leitor acima."}</span>
        </div>
        <div class="chapter-transcript-copy">
          ${preview.paragraphs.map(paragraphHtml).join("\n        ")}
        </div>
        <aside class="chapter-purchase">
          <p>${isSelectedScenes ? "A história completa continua no livro." : "A história continua no livro completo."}</p>
          <a href="${book.buyUrl}" target="_blank" rel="noopener noreferrer">Adquirir ${displayTitle} na UICLAP <span aria-hidden="true">↗</span></a>
          <a href="../">Voltar à página do livro</a>
        </aside>
      </article>
    </details>
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
  title: "Willian Quirino | Autor, ilustrador e compositor",
  description: "Conheça a trajetória de Willian Quirino: dos manuscritos de infância à publicação de Elemental, Veter e A Terra dos Monstros.",
  image: `${domain}/assets/images/autor-willian.jpg`,
  structuredData: [{
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Willian Quirino",
    url: `${domain}/autor/`,
    image: `${domain}/assets/images/autor-willian.jpg`,
    jobTitle: "Autor, ilustrador e compositor",
    description: "Autor de fantasia e ficção científica, criador das Histórias de Mentel.",
    sameAs: [
      appleArtist,
      "https://loja.uiclap.com/pesquisa=Willian%20Quirino",
    ],
  }],
  body: `
    <section class="profile-hero section">
      <div class="container author-layout">
        <div class="author-portrait reveal"><div class="portrait-frame"><img src="../assets/images/autor-willian.webp" alt="Retrato em preto e branco de Willian Quirino" width="512" height="512"></div><p class="portrait-signature">Willian Quirino</p></div>
        <div class="author-copy reveal"><p class="eyebrow">Autor, ilustrador e compositor</p><h1>Histórias perdidas.<br>Universos reencontrados.</h1>
          <p>Willian Quirino escreve fantasia e ficção científica atravessadas por conflitos, memórias, sobrevivência e transformação. Sua trajetória começou ainda na infância, antes que ele compreendesse completamente a dimensão dos mundos que estava criando.</p>
          <p>Os primeiros registros de <em>Elemental</em> foram escritos à mão em um diário de 2006, quando Willian tinha por volta de dez anos. Em outro diário, de 2008, surgiram os manuscritos de <em>Veter</em>.</p>
          <p>Depois de sofrer um derrame em 2012, grande parte das memórias anteriores àquele período se tornou fragmentada. Em 2013, antigos cadernos guardados revelaram histórias ainda inacabadas e abriram um caminho para reencontrar aquilo que havia sido criado.</p>
          <div class="feature-actions"><a class="button button-primary" href="../#livros">Conhecer os livros</a><a class="button button-ghost" href="../trilhas/">Ouvir as trilhas</a></div>
        </div>
      </div>
    </section>
    <section class="section author-story">
      <div class="container author-story-grid">
        <div class="reveal">
          <p class="eyebrow">Sobre o autor</p>
          <h2>Escrever também foi uma forma de reconstruir.</h2>
        </div>
        <div class="author-story-copy reveal">
          <p>Ao reencontrar os diários, Willian decidiu respeitar a essência das histórias criadas no passado. <em>Elemental</em> já possuía sua ideia central formada; em vez de substituí-la, ele continuou o universo que encontrou nos próprios cadernos.</p>
          <p>Em 2016, começou a desenvolver uma crônica ainda não publicada, criada para narrar acontecimentos anteriores a <em>Elemental</em>. A obra permanece em desenvolvimento e faz parte do universo maior que conecta suas histórias.</p>
          <p>Em 2017, concluiu <em>Elemental</em> e <em>Veter</em> e iniciou, novamente à mão, <em>A Terra dos Monstros</em>, finalizada no ano seguinte.</p>
          <p>Para Willian, uma história não termina nas palavras. Ilustrações, sons e emoções também podem aproximar o leitor de um mundo imaginado.</p>
        </div>
      </div>
    </section>
    <section class="section author-timeline-section" aria-labelledby="timeline-title">
      <div class="container">
        <div class="section-heading reveal">
          <p class="eyebrow">Uma trajetória em construção</p>
          <h2 id="timeline-title">Dos diários à publicação</h2>
        </div>
        <ol class="author-timeline">
          <li class="reveal"><time datetime="2006">2006</time><div><h3>As primeiras páginas de Elemental</h3><p>Os registros mais antigos da história aparecem em um diário manuscrito, quando Willian tinha por volta de dez anos.</p></div></li>
          <li class="reveal"><time datetime="2008">2008</time><div><h3>O nascimento de Veter</h3><p>Outro diário preserva os primeiros manuscritos da obra que viria a acompanhar sua jornada literária.</p></div></li>
          <li class="reveal"><time datetime="2012">2012</time><div><h3>Memórias fragmentadas</h3><p>Um derrame afeta grande parte das lembranças anteriores daquele período.</p></div></li>
          <li class="reveal"><time datetime="2013">2013</time><div><h3>O reencontro com os diários</h3><p>Os cadernos antigos devolvem histórias inacabadas e pistas de um universo que precisava continuar.</p></div></li>
          <li class="reveal"><time datetime="2016">2016</time><div><h3>Uma história anterior a Elemental</h3><p>Começa o desenvolvimento de uma crônica ainda inédita, ambientada antes dos acontecimentos do livro.</p></div></li>
          <li class="reveal"><time datetime="2017">2017</time><div><h3>Dois finais e um novo começo</h3><p><em>Elemental</em> e <em>Veter</em> são concluídos. No mesmo ano, começa o manuscrito de <em>A Terra dos Monstros</em>.</p></div></li>
          <li class="reveal"><time datetime="2018">2018</time><div><h3>A Terra dos Monstros é concluída</h3><p>A história de Melina e das cidades-fortaleza encontra sua forma completa no diário.</p></div></li>
          <li class="reveal"><time datetime="2025">2025</time><div><h3>Os cadernos se tornam livros</h3><p>Os manuscritos são transcritos, revisados e acompanhados por ilustrações e trilhas sonoras próprias.</p></div></li>
          <li class="reveal"><time datetime="2026">2026</time><div><h3>As histórias chegam aos leitores</h3><p><em>Veter</em>, <em>Elemental</em> e <em>A Terra dos Monstros</em> são publicados pela UICLAP.</p></div></li>
        </ol>
      </div>
    </section>
    <section class="author-closing">
      <div class="container reveal">
        <p class="eyebrow">Reconstrução pessoal</p>
        <blockquote>Histórias criadas na infância, reencontradas depois da perda de memória e finalmente compartilhadas com os leitores.</blockquote>
      </div>
    </section>`,
});

const musicCards = Object.values(books).filter((book) => book.spotify).map((book) => `
  <article class="soundtrack-card soundtrack-${book.accent} reveal">
    <div class="soundtrack-card-head"><img src="../assets/images/${webp(book.cover)}" alt="Capa de ${book.title}" width="555" height="800" loading="lazy" decoding="async"><div><p class="soundtrack-label"><span></span> Trilha sonora original</p><h2>${book.shortTitle || book.title}</h2><p>${book.soundtrackDescription}</p></div></div>
    <iframe class="spotify-player" src="${book.spotifyEmbed}" title="Trilha sonora de ${book.title} no Spotify" width="100%" height="352" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
    <a class="spotify-link" href="${book.spotify}" target="_blank" rel="noopener noreferrer">Ouvir no Spotify <span aria-hidden="true">↗</span></a>
  </article>`).join("");

const releaseCards = musicReleases.map((release) => {
  const query = encodeURIComponent(`${release.title} Willian Quirino`);
  return `
    <article class="release-card reveal">
      <img src="../assets/images/music/${release.artwork}" alt="Capa de ${release.displayTitle}" width="600" height="600" loading="lazy" decoding="async">
      <div class="release-card-copy">
        <p class="release-meta">${release.type} · ${release.year} · ${release.tracks} ${release.tracks === 1 ? "faixa" : "faixas"}</p>
        <h3>${release.displayTitle}</h3>
        <p>${release.description}</p>
        <div class="release-links" aria-label="Ouvir ${release.displayTitle}">
          <a href="${release.apple}" target="_blank" rel="noopener noreferrer">Apple Music</a>
          <a href="https://open.spotify.com/search/${query}" target="_blank" rel="noopener noreferrer">Spotify</a>
          <a href="https://music.youtube.com/search?q=${query}" target="_blank" rel="noopener noreferrer">YouTube Music</a>
          <a href="https://www.shazam.com/search/${query}" target="_blank" rel="noopener noreferrer">Shazam</a>
        </div>
      </div>
    </article>`;
}).join("");

const musicPage = simplePage({
  slug: "trilhas",
  title: "Trilhas e músicas do universo | Willian Quirino",
  description: "Explore a discografia de Willian Quirino: trilhas de A Terra dos Monstros e Veter, álbuns, EPs e singles lançados em 2025 e 2026.",
  image: `${domain}/assets/images/music/terra-vol2.jpg`,
  structuredData: musicReleases.map((release) => ({
    "@context": "https://schema.org",
    "@type": release.type === "Single" ? "MusicRecording" : "MusicAlbum",
    name: release.title,
    byArtist: { "@type": "Person", name: "Willian Quirino", url: `${domain}/autor/` },
    datePublished: release.date,
    ...(release.type === "Single" ? {} : { numTracks: release.tracks }),
    url: release.apple,
    image: `${domain}/assets/images/music/${release.artwork.replace(".webp", ".jpg")}`,
    sameAs: [
      release.apple,
      `https://music.youtube.com/search?q=${encodeURIComponent(`${release.title} Willian Quirino`)}`,
      `https://www.shazam.com/search/${encodeURIComponent(`${release.title} Willian Quirino`)}`,
    ],
  })),
  body: `
    <section class="page-hero music-page-hero section"><div class="container"><p class="eyebrow reveal">Mundos para ler e ouvir</p><h1 class="reveal">Trilhas e músicas do universo</h1><p class="reveal">Álbuns, EPs e singles criados para levar as histórias além das páginas e transformar cada universo em som.</p>
      <nav class="music-platforms reveal" aria-label="Plataformas musicais">
        <a href="${appleArtist}" target="_blank" rel="noopener noreferrer">Apple Music</a>
        <a href="${youtubeMusicArtistSearch}" target="_blank" rel="noopener noreferrer">YouTube Music</a>
        <a href="${shazamArtistSearch}" target="_blank" rel="noopener noreferrer">Shazam</a>
      </nav>
    </div></section>
    <section class="section soundtracks-section">
      <div class="container">
        <div class="section-heading section-heading-split reveal"><div><p class="eyebrow">Trilhas principais</p><h2>Dois universos, duas identidades sonoras</h2></div><p>As trilhas foram compostas para acompanhar o ritmo emocional de cada história, dos muros de Avoltera às ruas de Belonia.</p></div>
        <div class="soundtrack-grid">${musicCards}</div>
      </div>
    </section>
    <section class="section discography-section" aria-labelledby="discography-title">
      <div class="container">
        <div class="section-heading reveal"><p class="eyebrow">Discografia</p><h2 id="discography-title">Lançamentos do universo</h2><p>Uma coleção em expansão, reunindo trilhas completas e composições lançadas separadamente.</p></div>
        <div class="release-grid">${releaseCards}</div>
      </div>
    </section>`,
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
