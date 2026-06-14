const previews = window.BOOK_PREVIEWS || {};
const params = new URLSearchParams(window.location.search);
const requestedBook = params.get("livro") || "terra";
const book = previews[requestedBook] || previews.terra;
const audiobooks = {
  terra: {
    src: "assets/audio/terra-dos-monstros-capitulo-1.m4a",
    title: "Um dia de cada vez",
  },
};
const audiobook = audiobooks[requestedBook];

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
  turn: document.querySelector("[data-reader-turn]"),
  turnFront: document.querySelector("[data-reader-turn-front]"),
  turnBack: document.querySelector("[data-reader-turn-back]"),
  measure: document.querySelector("[data-reader-measure]"),
  previous: document.querySelector("[data-reader-prev]"),
  next: document.querySelector("[data-reader-next]"),
  pageLabel: document.querySelector("[data-reader-page-label]"),
  progress: document.querySelector("[data-reader-progress]"),
  audioPanel: document.querySelector("[data-reader-audio]"),
  audioTitle: document.querySelector("[data-audio-title]"),
  audio: document.querySelector("[data-audio-element]"),
  audioPlay: document.querySelector("[data-audio-play]"),
  audioPlayIcon: document.querySelector("[data-audio-play-icon]"),
  audioProgress: document.querySelector("[data-audio-progress]"),
  audioCurrent: document.querySelector("[data-audio-current]"),
  audioDuration: document.querySelector("[data-audio-duration]"),
  audioSpeed: document.querySelector("[data-audio-speed]"),
};

let pages = [];
let currentIndex = 0;
let isAnimating = false;
let isMobile = window.matchMedia("(max-width: 700px)").matches;
let resizeTimer;
let activeTurn = null;
let dragState = null;
let turnAnimationFrame = 0;
const playbackRates = [1, 1.25, 1.5, 0.75];
let playbackRateIndex = 0;

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

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const updateAudioButton = () => {
  const isPlaying = !elements.audio.paused;
  elements.audioPlayIcon.textContent = isPlaying ? "❚❚" : "▶";
  elements.audioPlay.setAttribute(
    "aria-label",
    isPlaying ? "Pausar audiobook" : "Reproduzir audiobook"
  );
  elements.audioPanel.classList.toggle("is-playing", isPlaying);
};

const initializeAudiobook = () => {
  if (!audiobook) return;

  elements.audioPanel.hidden = false;
  elements.audioTitle.textContent = audiobook.title;
  elements.audio.src = audiobook.src;

  elements.audioPlay.addEventListener("click", async () => {
    if (elements.audio.paused) {
      try {
        await elements.audio.play();
      } catch {
        elements.audioPanel.classList.add("has-error");
      }
    } else {
      elements.audio.pause();
    }
  });

  elements.audio.addEventListener("play", updateAudioButton);
  elements.audio.addEventListener("pause", updateAudioButton);
  elements.audio.addEventListener("ended", updateAudioButton);
  elements.audio.addEventListener("loadedmetadata", () => {
    elements.audioDuration.textContent = formatTime(elements.audio.duration);
  });
  elements.audio.addEventListener("timeupdate", () => {
    const percentage = elements.audio.duration
      ? (elements.audio.currentTime / elements.audio.duration) * 100
      : 0;
    elements.audioProgress.value = percentage;
    elements.audioProgress.style.setProperty("--audio-progress", `${percentage}%`);
    elements.audioCurrent.textContent = formatTime(elements.audio.currentTime);
  });
  elements.audio.addEventListener("error", () => {
    elements.audioPanel.classList.add("has-error");
    elements.audioTitle.textContent = "Não foi possível carregar o audiobook";
    elements.audioPlay.disabled = true;
  });

  elements.audioProgress.addEventListener("input", () => {
    if (!elements.audio.duration) return;
    const percentage = Number(elements.audioProgress.value);
    elements.audio.currentTime = (percentage / 100) * elements.audio.duration;
    elements.audioProgress.style.setProperty("--audio-progress", `${percentage}%`);
  });

  elements.audioSpeed.addEventListener("click", () => {
    playbackRateIndex = (playbackRateIndex + 1) % playbackRates.length;
    const rate = playbackRates[playbackRateIndex];
    elements.audio.playbackRate = rate;
    elements.audioSpeed.textContent = `${String(rate).replace(".", ",")}×`;
    elements.audioSpeed.setAttribute(
      "aria-label",
      `Velocidade de reprodução: ${String(rate).replace(".", ",")} vezes`
    );
  });
};

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

const preparePageTurn = (direction, nextIndex) => {
  const movingForward = direction > 0;
  const currentLeft = pages[currentIndex];
  const currentRight = pages[currentIndex + 1];
  const nextLeft = pages[nextIndex];
  const nextRight = pages[nextIndex + 1];

  elements.turn.className = `reader-turn ${movingForward ? "is-next" : "is-prev"}`;
  elements.turnFront.className =
    `reader-page reader-turn-face reader-turn-front ${movingForward ? "reader-page-right" : "reader-page-left"}`;
  elements.turnBack.className =
    `reader-page reader-turn-face reader-turn-back ${movingForward ? "reader-page-left" : "reader-page-right"}`;

  if (isMobile) {
    renderPage(pages[nextIndex], elements.rightPage);
    renderPage(pages[currentIndex], elements.turnFront);
    renderPage(null, elements.turnBack);
    return;
  }

  if (movingForward) {
    renderPage(currentLeft, elements.leftPage);
    renderPage(nextRight, elements.rightPage);
    renderPage(currentRight, elements.turnFront);
    renderPage(nextLeft, elements.turnBack);
    return;
  }

  renderPage(nextLeft, elements.leftPage);
  renderPage(currentRight, elements.rightPage);
  renderPage(currentLeft, elements.turnFront);
  renderPage(nextRight, elements.turnBack);
};

const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));

const setTurnProgress = (progress) => {
  if (!activeTurn) return;

  const normalized = clamp(progress, 0, 1);
  const movingForward = activeTurn.direction > 0;

  if (isMobile) {
    const frontAngle = normalized * 90 * (movingForward ? -1 : 1);
    const frontShadow = Math.sin(normalized * Math.PI) * 0.44;

    activeTurn.progress = normalized;
    elements.turn.style.setProperty("--turn-progress", String(normalized));
    elements.turnFront.style.opacity = "1";
    elements.turnFront.style.transform = `rotateY(${frontAngle}deg)`;
    elements.turnFront.style.filter =
      `drop-shadow(${movingForward ? -1 : 1}rem 1rem 1.4rem rgba(0, 0, 0, ${frontShadow}))`;
    elements.turnBack.style.display = "none";
    elements.turn.style.setProperty(
      "--front-shadow-opacity",
      String(Math.sin(normalized * Math.PI) * 0.9)
    );
    elements.turn.style.setProperty("--back-shadow-opacity", "0");
    return;
  }

  const frontProgress = Math.min(normalized * 2, 1);
  const backProgress = Math.max((normalized - 0.5) * 2, 0);
  const frontAngle = frontProgress * 90 * (movingForward ? -1 : 1);
  const backAngle = (1 - backProgress) * 90 * (movingForward ? 1 : -1);
  const frontShadow = Math.sin(frontProgress * Math.PI) * 0.44;
  const backShadow = Math.sin((1 - backProgress) * Math.PI) * 0.38;

  activeTurn.progress = normalized;
  elements.turn.style.setProperty("--turn-progress", String(normalized));
  elements.turnFront.style.opacity = normalized < 0.5 ? "1" : "0";
  elements.turnFront.style.transform = `rotateY(${frontAngle}deg)`;
  elements.turnFront.style.filter =
    `drop-shadow(${movingForward ? -1 : 1}rem 1rem 1.4rem rgba(0, 0, 0, ${frontShadow}))`;
  elements.turnBack.style.opacity = normalized >= 0.5 ? "1" : "0";
  elements.turnBack.style.transform = `rotateY(${backAngle}deg)`;
  elements.turnBack.style.filter =
    `drop-shadow(${movingForward ? 1 : -1}rem 1rem 1.4rem rgba(0, 0, 0, ${backShadow}))`;
  elements.turn.style.setProperty(
    "--front-shadow-opacity",
    String(Math.sin(frontProgress * Math.PI) * 0.9)
  );
  elements.turn.style.setProperty(
    "--back-shadow-opacity",
    String(Math.sin(backProgress * Math.PI) * 0.72)
  );
};

const beginTurn = (direction) => {
  if (isAnimating || activeTurn) return false;
  const step = spreadStep();
  const nextIndex = currentIndex + direction * step;
  if (nextIndex < 0 || nextIndex >= pages.length) return false;

  isAnimating = true;
  elements.previous.disabled = true;
  elements.next.disabled = true;
  preparePageTurn(direction, nextIndex);
  elements.book.classList.add("is-turning");
  elements.turn.classList.add("is-active");
  activeTurn = { direction, nextIndex, progress: 0 };
  setTurnProgress(0);
  return true;
};

const finishTurn = (commit) => {
  if (!activeTurn) return;
  window.cancelAnimationFrame(turnAnimationFrame);
  if (commit) {
    currentIndex = activeTurn.nextIndex;
  }
  activeTurn = null;
  dragState = null;
  elements.book.classList.remove("is-turning", "is-dragging");
  elements.turn.className = "reader-turn";
  elements.turn.removeAttribute("style");
  elements.turnFront.removeAttribute("style");
  elements.turnBack.removeAttribute("style");
  elements.turnFront.innerHTML = "";
  elements.turnBack.innerHTML = "";
  isAnimating = false;
  renderSpread();
};

const animateTurnTo = (target, duration = 430) => {
  if (!activeTurn) return;
  window.cancelAnimationFrame(turnAnimationFrame);
  const startProgress = activeTurn.progress;
  const distance = Math.abs(target - startProgress);
  const adjustedDuration = Math.max(140, duration * distance);
  const startTime = performance.now();

  const tick = (now) => {
    if (!activeTurn) return;
    const elapsed = clamp((now - startTime) / adjustedDuration, 0, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    setTurnProgress(startProgress + (target - startProgress) * eased);

    if (elapsed < 1) {
      turnAnimationFrame = window.requestAnimationFrame(tick);
      return;
    }

    finishTurn(target === 1);
  };

  turnAnimationFrame = window.requestAnimationFrame(tick);
};

const turnPages = (direction) => {
  if (!beginTurn(direction)) return;
  animateTurnTo(1, 820);
};

const pointerX = (event) => event.clientX;

const directionFromPointer = (startX, currentX, bounds) => {
  const distance = currentX - startX;
  if (Math.abs(distance) < 8) return 0;

  if (isMobile) return distance < 0 ? 1 : -1;

  const center = bounds.left + bounds.width / 2;
  if (startX >= center && distance < 0) return 1;
  if (startX < center && distance > 0) return -1;
  return 0;
};

const handlePointerDown = (event) => {
  if (event.button !== undefined && event.button !== 0) return;
  if (isAnimating || event.target.closest("a, button, input, audio")) return;

  dragState = {
    pointerId: event.pointerId,
    startX: pointerX(event),
    lastX: pointerX(event),
    startedAt: performance.now(),
    bounds: elements.book.getBoundingClientRect(),
    direction: 0,
  };
  elements.book.setPointerCapture?.(event.pointerId);
};

const handlePointerMove = (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  const currentX = pointerX(event);

  if (!dragState.direction) {
    const direction = directionFromPointer(
      dragState.startX,
      currentX,
      dragState.bounds
    );
    if (!direction) return;
    if (!beginTurn(direction)) {
      dragState = null;
      return;
    }
    dragState.direction = direction;
    elements.book.classList.add("is-dragging");
  }

  event.preventDefault();
  dragState.lastX = currentX;
  const distance = currentX - dragState.startX;
  const signedDistance = dragState.direction > 0 ? -distance : distance;
  const pageWidth = isMobile ? dragState.bounds.width : dragState.bounds.width / 2;
  setTurnProgress(signedDistance / pageWidth);
};

const handlePointerEnd = (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;

  if (!activeTurn || !dragState.direction) {
    dragState = null;
    return;
  }

  const elapsed = Math.max(performance.now() - dragState.startedAt, 1);
  const distance = dragState.lastX - dragState.startX;
  const velocity = (dragState.direction > 0 ? -distance : distance) / elapsed;
  const shouldComplete = activeTurn.progress >= 0.42 || velocity > 0.65;
  dragState = null;
  elements.book.classList.remove("is-dragging");
  animateTurnTo(shouldComplete ? 1 : 0, shouldComplete ? 460 : 360);
};

const cancelPointerDrag = (event) => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  dragState = null;
  if (activeTurn) {
    elements.book.classList.remove("is-dragging");
    animateTurnTo(0, 300);
  }
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

  initializeAudiobook();
  buildPages();
};

elements.previous.addEventListener("click", () => turnPages(-1));
elements.next.addEventListener("click", () => turnPages(1));

window.addEventListener("keydown", (event) => {
  const isInteractive = event.target.closest("button, a, input, audio");
  if (isInteractive) return;
  if (event.key === "ArrowLeft") turnPages(-1);
  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    turnPages(1);
  }
});

elements.book.addEventListener("pointerdown", handlePointerDown);
elements.book.addEventListener("pointermove", handlePointerMove);
elements.book.addEventListener("pointerup", handlePointerEnd);
elements.book.addEventListener("pointercancel", cancelPointerDrag);
elements.book.addEventListener("lostpointercapture", cancelPointerDrag);

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
