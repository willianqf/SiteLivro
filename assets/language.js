(() => {
  const STORAGE_KEY = "wq-language-v1";
  const current = document.documentElement.lang.toLowerCase().startsWith("en") ? "en" : "pt";
  const links = [...document.querySelectorAll("[data-language-link]")];

  const save = (language) => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // A navegação continua funcionando quando o armazenamento está indisponível.
    }
  };

  links.forEach((link) => {
    link.addEventListener("click", () => save(link.dataset.languageLink));
  });

  if (!document.body.hasAttribute("data-auto-language")) return;

  let preferred;
  try {
    preferred = localStorage.getItem(STORAGE_KEY);
  } catch {
    preferred = null;
  }

  if (!preferred) {
    const browserLanguage = (navigator.languages?.[0] || navigator.language || "pt").toLowerCase();
    preferred = browserLanguage.startsWith("en") ? "en" : "pt";
  }

  if (preferred === current) return;
  const destination = links.find((link) => link.dataset.languageLink === preferred);
  if (destination) window.location.replace(destination.href);
})();
