const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setMenuState = (isOpen) => {
  menuButton?.setAttribute("aria-expanded", String(isOpen));
  navigation?.classList.toggle("is-open", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
  setMenuState(isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) setMenuState(false);
});

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 30);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealElements = document.querySelectorAll(".reveal");

[
  ".hero-content .reveal",
  ".book-grid .reveal",
  ".feature-layout .reveal",
  ".soundtrack-grid .reveal",
  ".gallery-grid .reveal",
  ".author-layout .reveal",
].forEach((selector) => {
  document.querySelectorAll(selector).forEach((element, index) => {
    element.style.setProperty("--reveal-delay", `${Math.min(index * 110, 330)}ms`);
  });
});

if ("IntersectionObserver" in window && !prefersReducedMotion.matches) {
  const revealImmediately = (element) => {
    const bounds = element.getBoundingClientRect();
    const activationBuffer = Math.min(window.innerHeight * 0.12, 120);
    const isNearViewport =
      bounds.bottom >= 0 && bounds.top <= window.innerHeight + activationBuffer;

    if (isNearViewport) element.classList.add("is-visible");
    return isNearViewport;
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.01, rootMargin: "0px 0px 12% 0px" });

  revealElements.forEach((element) => {
    if (!revealImmediately(element)) revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const parallaxLayers = [
  {
    element: document.querySelector(".hero-media"),
    section: document.querySelector(".hero"),
    distance: 32,
  },
  ...[...document.querySelectorAll(".book-feature")].map((section) => ({
    element: section.querySelector(".feature-backdrop img"),
    section,
    distance: 44,
  })),
  {
    element: document.querySelector(".final-cta-bg"),
    section: document.querySelector(".final-cta"),
    distance: 32,
  },
].filter(({ element, section }) => element && section);

let parallaxFrame = null;

const updateParallax = () => {
  parallaxFrame = null;

  if (prefersReducedMotion.matches || window.innerWidth <= 700) {
    parallaxLayers.forEach(({ element }) => element.style.removeProperty("--parallax-y"));
    return;
  }

  const viewportCenter = window.innerHeight / 2;

  parallaxLayers.forEach(({ element, section, distance }) => {
    const bounds = section.getBoundingClientRect();
    if (bounds.bottom < -100 || bounds.top > window.innerHeight + 100) return;

    const sectionCenter = bounds.top + bounds.height / 2;
    const progress = (viewportCenter - sectionCenter) / ((window.innerHeight + bounds.height) / 2);
    const offset = Math.max(-1, Math.min(1, progress)) * distance;
    element.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
  });
};

const requestParallaxUpdate = () => {
  if (parallaxFrame !== null) return;
  parallaxFrame = window.requestAnimationFrame(updateParallax);
};

updateParallax();
window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
window.addEventListener("resize", requestParallaxUpdate);

document.querySelectorAll("[data-book-3d]").forEach((shell) => {
  const scene = shell.querySelector("[data-book-3d-scene]");
  const model = shell.querySelector("[data-book-3d-model]");
  const reset = shell.querySelector("[data-book-3d-reset]");
  const initialRotation = { x: -4, y: 16 };
  const rotation = { ...initialRotation };
  let drag = null;
  let frame = 0;

  const render = () => {
    frame = 0;
    model.style.setProperty("--book-rotate-x", `${rotation.x}deg`);
    model.style.setProperty("--book-rotate-y", `${rotation.y}deg`);
  };

  const requestRender = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  const restore = () => {
    rotation.x = initialRotation.x;
    rotation.y = initialRotation.y;
    scene.classList.remove("is-dragging");
    requestRender();
  };

  scene.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    drag = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      rotationX: rotation.x,
      rotationY: rotation.y,
    };
    scene.classList.add("is-dragging");
    scene.setPointerCapture?.(event.pointerId);
  });

  scene.addEventListener("pointermove", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.x;
    const deltaY = event.clientY - drag.y;
    if (Math.abs(deltaX) > Math.abs(deltaY)) event.preventDefault();
    rotation.y = drag.rotationY + deltaX * 0.48;
    rotation.x = Math.max(-28, Math.min(28, drag.rotationX - deltaY * 0.32));
    requestRender();
  });

  const endDrag = (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag = null;
    scene.classList.remove("is-dragging");
  };

  scene.addEventListener("pointerup", endDrag);
  scene.addEventListener("pointercancel", endDrag);
  scene.addEventListener("lostpointercapture", endDrag);
  scene.addEventListener("keydown", (event) => {
    const changes = {
      ArrowLeft: [0, -12],
      ArrowRight: [0, 12],
      ArrowUp: [-7, 0],
      ArrowDown: [7, 0],
    };
    const change = changes[event.key];
    if (!change) return;
    event.preventDefault();
    rotation.x = Math.max(-28, Math.min(28, rotation.x + change[0]));
    rotation.y += change[1];
    requestRender();
  });

  reset?.addEventListener("click", restore);
  render();
});

const navLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const trackedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visible.target.id}`
      );
    });
  }, { threshold: [0.18, 0.35, 0.55], rootMargin: "-20% 0px -60%" });

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

const lightbox = document.querySelector("[data-lightbox-dialog]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const closeLightbox = document.querySelector("[data-lightbox-close]");

document.querySelectorAll("[data-lightbox]").forEach((item) => {
  item.addEventListener("click", () => {
    const image = item.querySelector("img");
    lightboxImage.src = item.dataset.src || image?.src || "";
    lightboxImage.alt = image?.alt || "";
    lightboxCaption.textContent = item.dataset.caption || "";

    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }
  });
});

closeLightbox?.addEventListener("click", () => lightbox.close());

lightbox?.addEventListener("click", (event) => {
  const bounds = lightbox.getBoundingClientRect();
  const isOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (isOutside) lightbox.close();
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
