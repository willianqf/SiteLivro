const previews = window.BOOK_PREVIEWS || {};
const params = new URLSearchParams(window.location.search);
const requestedBook = params.get("livro") || "terra";
const book = previews[requestedBook] || previews.terra;

const elements = {
  body: document.body,
  backdrop: document.querySelector("[data-reader-backdrop]"),
  title: document.querySelector("[data-reader-title]"),
  heading: document.querySelector("[data-reader-heading]"),
  label: document.querySelector("[data-reader-label]"),
  wordCount: document.querySelector("[data-reader-word-count]"),
  buyLinks: document.querySelectorAll("[data-reader-buy]"),
  book: document.querySelector("[data-reader-book]"),
  leftPage: document.querySelector("[data-reader-page-left]"),
  rightPage: document.querySelector("[data-reader-page-right]"),
  measure: document.querySelector("[data-reader-measure]"),
  previous: document.querySelector("[data-reader-prev]"),
  next: document.querySelector("[data-reader-next]"),
  pageLabel: document.querySelector("[data-reader-page-label]"),
  progress: document.querySelector("[data-reader-progress]"),
};

let pages = [];
let currentIndex = 0;
let isAnimating = false;
let isMobile = window.matchMedia("(max-width: 700px)").matches;
let resizeTimer;
let touchStartX = 0;

const textOf = (paragraph) => paragraph.text.trim();

const createTextPageShell = (pageNumber) => {
  const page = document.createElement("div");
  page.className = "reader-page-inner";

  const runningHead = document.createElement("div");
  runningHead.className = "reader-running-head";
  runningHead.textContent = book.shortTitle;

  const copy = document.createElement("div");
  copy.className = "reader-page-copy";

  const number = document.createElement("div");
  number.className = "reader-page-number";
  number.textContent = String(pageNumber);

  page.append(runningHead, copy, number);
  return { page, copy };
};

const createParagraph = (paragraph) => {
  const node = document.createElement("p");
  const text = textOf(paragraph);
  const normalizedStyle = (paragraph.style || "").toLowerCase();

  if (text === "***") {
    node.className = "scene-break";
    node.textContent = "• • •";
  } else {
    node.textContent = text;
  }

  if (normalizedStyle.includes("heading") || normalizedStyle.includes("subtitle")) {
    node.classList.add("chapter-subheading");
  }

  if (paragraph.alignment) {
    node.style.textAlign = paragraph.alignment;
  }

  return node;
};

const contentFits = (copy) => copy.scrollHeight <= copy.clientHeight + 1;

const paginateText = () => {
  const textPages = [];
  elements.measure.innerHTML = "";
  elements.measure.className = "reader-measure reader-page";

  let pageNumber = 1;
  let shell = createTextPageShell(pageNumber);
  elements.measure.append(shell.page);
  let hasContent = false;

  const saveCurrentPage = () => {
    if (!hasContent) return;
    textPages.push({
      type: "text",
      html: shell.page.outerHTML,
      pageNumber,
    });
    pageNumber += 1;
    elements.measure.innerHTML = "";
    shell = createTextPageShell(pageNumber);
    elements.measure.append(shell.page);
    hasContent = false;
  };

  book.paragraphs.forEach((paragraph) => {
    const node = createParagraph(paragraph);
    shell.copy.append(node);

    if (contentFits(shell.copy)) {
      hasContent = true;
      return;
    }

    shell.copy.removeChild(node);
    saveCurrentPage();
    shell.copy.append(node);
    hasContent = true;
  });

  saveCurrentPage();
  elements.measure.innerHTML = "";
  return textPages;
};

const buildPages = () => {
  const coverPage = {
    type: "cover",
    cover: book.cover,
    art: book.art,
  };

  const openerPage = {
    type: "opener",
    art: book.art,
  };

  const endingPage = {
    type: "ending",
    art: book.art,
  };

  pages = [coverPage, openerPage, ...paginateText(), endingPage];
  currentIndex = Math.min(currentIndex, Math.max(0, pages.length - (isMobile ? 1 : 2)));
  renderSpread();
};

const renderSpecialPage = (page, target) => {
  if (page.type === "cover") {
    target.innerHTML = `
      <div class="reader-cover" style="--page-art:url('${page.art}')">
        <img src="${page.cover}" alt="Capa de ${book.title}">
      </div>
    `;
    return;
  }

  if (page.type === "opener") {
    target.innerHTML = `
      <div class="reader-opener" style="--page-art:url('${page.art}')">
        <div>
          <span>${book.chapterLabel}</span>
          <h2>${book.chapterTitle}</h2>
          <p>Uma prévia gratuita do universo de ${book.shortTitle}.</p>
        </div>
      </div>
    `;
    return;
  }

  target.innerHTML = `
    <div class="reader-ending" style="--page-art:url('${page.art}')">
      <div>
        <span>A história continua...</span>
        <h2>Você chegou ao fim da prévia</h2>
        <p>${book.closing}</p>
        <a href="${book.buyUrl}" target="_blank" rel="noopener noreferrer">
          Adquirir o livro na UICLAP <span aria-hidden="true">↗</span>
        </a>
        <a class="reader-site-return" href="index.html#livros">Voltar aos livros</a>
      </div>
    </div>
  `;
};

const renderPage = (page, target) => {
  target.classList.toggle("is-empty", !page);

  if (!page) {
    target.innerHTML = "";
    return;
  }

  if (page.type === "text") {
    target.innerHTML = page.html;
    return;
  }

  renderSpecialPage(page, target);
};

const spreadStep = () => (isMobile ? 1 : 2);

const renderSpread = () => {
  const left = isMobile ? null : pages[currentIndex];
  const right = isMobile ? pages[currentIndex] : pages[currentIndex + 1];

  renderPage(left, elements.leftPage);
  renderPage(right, elements.rightPage);

  const visibleEnd = Math.min(currentIndex + spreadStep(), pages.length);
  const displayStart = currentIndex + 1;
  elements.pageLabel.textContent = isMobile
    ? `Página ${displayStart} de ${pages.length}`
    : `Páginas ${displayStart}–${visibleEnd} de ${pages.length}`;
  elements.progress.style.width = `${(visibleEnd / pages.length) * 100}%`;
  elements.previous.disabled = currentIndex === 0;
  elements.next.disabled = currentIndex + spreadStep() >= pages.length;
};

const turnPages = (direction) => {
  if (isAnimating) return;
  const step = spreadStep();
  const nextIndex = currentIndex + direction * step;
  if (nextIndex < 0 || nextIndex >= pages.length) return;

  isAnimating = true;
  elements.book.classList.add(direction > 0 ? "turning-next" : "turning-prev");

  window.setTimeout(() => {
    currentIndex = nextIndex;
    renderSpread();
    elements.book.classList.remove("turning-next", "turning-prev");
    isAnimating = false;
  }, 460);
};

const initialize = () => {
  if (!book) {
    document.querySelector(".reader-main").innerHTML =
      '<p class="reader-error">Não foi possível encontrar esta prévia.</p>';
    return;
  }

  document.title = `${book.chapterTitle} | ${book.shortTitle}`;
  elements.body.classList.add(`theme-${book.theme}`);
  elements.body.style.setProperty("--reader-font", book.font);
  elements.backdrop.style.backgroundImage = `url("${book.art}")`;
  elements.title.textContent = book.title;
  elements.heading.textContent = book.chapterTitle;
  elements.label.textContent = book.chapterLabel;
  elements.wordCount.textContent = `${book.wordCount.toLocaleString("pt-BR")} palavras nesta prévia`;
  elements.buyLinks.forEach((link) => {
    link.href = book.buyUrl;
  });

  buildPages();
};

elements.previous.addEventListener("click", () => turnPages(-1));
elements.next.addEventListener("click", () => turnPages(1));

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") turnPages(-1);
  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    turnPages(1);
  }
});

elements.book.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

elements.book.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(distance) < 45) return;
  turnPages(distance < 0 ? 1 : -1);
}, { passive: true });

window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    const wasMobile = isMobile;
    isMobile = window.matchMedia("(max-width: 700px)").matches;
    if (wasMobile !== isMobile && !isMobile && currentIndex % 2 !== 0) {
      currentIndex -= 1;
    }
    buildPages();
  }, 180);
});

initialize();
