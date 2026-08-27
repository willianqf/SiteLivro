(() => {
  const consentScriptUrl = document.currentScript?.src;
  const STORAGE_KEY = "wq-privacy-v1";
  const analyticsId = "G-E9LKKPWMXY";
  const adsId = "AW-17919559276";
  const adsenseClient = "ca-pub-1620158714396057";
  const emptyPreference = { analytics: false, marketing: false };
  let preference = null;
  let settingsDialog;
  let banner;
  let googleLoaded = false;
  let adsenseLoaded = false;
  const privacyUrl = consentScriptUrl
    ? new URL("../privacidade/", consentScriptUrl).href
    : "/privacidade/";

  const readPreference = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved.analytics === "boolean" && typeof saved.marketing === "boolean") {
        return saved;
      }
    } catch {
      // A visita continua normalmente se o armazenamento estiver indisponível.
    }
    return null;
  };

  const addScript = (src, attributes = {}) => {
    if (document.querySelector(`script[src="${src}"]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value));
    document.head.append(script);
  };

  const ensureGoogleTag = (choice) => {
    if (!choice.analytics && !choice.marketing) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };

    window.gtag("consent", googleLoaded ? "update" : "default", {
      analytics_storage: choice.analytics ? "granted" : "denied",
      ad_storage: choice.marketing ? "granted" : "denied",
      ad_user_data: choice.marketing ? "granted" : "denied",
      ad_personalization: choice.marketing ? "granted" : "denied",
    });

    if (!googleLoaded) {
      const loaderId = choice.analytics ? analyticsId : adsId;
      addScript(`https://www.googletagmanager.com/gtag/js?id=${loaderId}`);
      window.gtag("js", new Date());
      googleLoaded = true;
    }

    if (choice.analytics) {
      window.gtag("config", analyticsId, { anonymize_ip: true });
    }
    if (choice.marketing) {
      window.gtag("config", adsId);
    }
  };

  const applyPreference = (choice) => {
    if (googleLoaded && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: choice.analytics ? "granted" : "denied",
        ad_storage: choice.marketing ? "granted" : "denied",
        ad_user_data: choice.marketing ? "granted" : "denied",
        ad_personalization: choice.marketing ? "granted" : "denied",
      });
    }

    ensureGoogleTag(choice);

    if (choice.marketing && !adsenseLoaded) {
      addScript(
        `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`,
        { crossorigin: "anonymous" }
      );
      adsenseLoaded = true;
    }
  };

  const savePreference = (choice) => {
    preference = { ...choice, updatedAt: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
    } catch {
      // A preferência vale para esta página mesmo sem armazenamento persistente.
    }
    applyPreference(preference);
    banner?.remove();
    banner = null;
    settingsDialog?.close();
    document.dispatchEvent(new CustomEvent("wq:consent", { detail: preference }));
  };

  const openSettings = () => {
    const current = preference || emptyPreference;
    settingsDialog.querySelector("[name=analytics]").checked = current.analytics;
    settingsDialog.querySelector("[name=marketing]").checked = current.marketing;
    if (typeof settingsDialog.showModal === "function") settingsDialog.showModal();
    else settingsDialog.setAttribute("open", "");
  };

  const createSettingsDialog = () => {
    settingsDialog = document.createElement("dialog");
    settingsDialog.className = "consent-dialog";
    settingsDialog.setAttribute("aria-labelledby", "consent-settings-title");
    settingsDialog.innerHTML = `
      <form method="dialog" class="consent-settings-form">
        <div class="consent-dialog-heading">
          <div><span>Suas preferências</span><h2 id="consent-settings-title">Gerenciar cookies</h2></div>
          <button class="consent-close" value="cancel" aria-label="Fechar preferências">×</button>
        </div>
        <p>Recursos não essenciais permanecem desligados até sua autorização.</p>
        <label class="consent-option is-required"><span><strong>Necessários</strong><small>Preferência de privacidade e funcionamento básico.</small></span><input type="checkbox" checked disabled></label>
        <label class="consent-option"><span><strong>Analíticos</strong><small>Medição agregada de páginas e interações.</small></span><input type="checkbox" name="analytics"></label>
        <label class="consent-option"><span><strong>Publicidade</strong><small>Google Ads e AdSense para campanhas e anúncios.</small></span><input type="checkbox" name="marketing"></label>
        <div class="consent-dialog-actions">
          <button class="consent-button consent-secondary" type="button" data-consent-reject>Rejeitar opcionais</button>
          <button class="consent-button consent-primary" type="submit" value="save">Salvar escolhas</button>
        </div>
      </form>`;
    document.body.append(settingsDialog);

    settingsDialog.addEventListener("close", () => {
      if (settingsDialog.returnValue !== "save") return;
      savePreference({
        analytics: settingsDialog.querySelector("[name=analytics]").checked,
        marketing: settingsDialog.querySelector("[name=marketing]").checked,
      });
    });
    settingsDialog.querySelector("[data-consent-reject]").addEventListener("click", () => {
      savePreference(emptyPreference);
    });
  };

  const createBanner = () => {
    banner = document.createElement("section");
    banner.className = "consent-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-labelledby", "consent-title");
    banner.innerHTML = `
      <div class="consent-banner-copy">
        <span>Privacidade sob seu controle</span>
        <h2 id="consent-title">Você escolhe o que carregar</h2>
        <p>Usamos recursos opcionais de métricas e publicidade somente com sua autorização. <a href="${privacyUrl}">Entenda como funciona.</a></p>
      </div>
      <div class="consent-banner-actions">
        <button class="consent-button consent-secondary" type="button" data-consent-reject>Rejeitar</button>
        <button class="consent-button consent-secondary" type="button" data-consent-manage>Gerenciar</button>
        <button class="consent-button consent-primary" type="button" data-consent-accept>Aceitar</button>
      </div>`;
    document.body.append(banner);
    banner.querySelector("[data-consent-reject]").addEventListener("click", () => savePreference(emptyPreference));
    banner.querySelector("[data-consent-manage]").addEventListener("click", openSettings);
    banner.querySelector("[data-consent-accept]").addEventListener("click", () => savePreference({ analytics: true, marketing: true }));
  };

  const initialize = () => {
    createSettingsDialog();
    preference = readPreference();
    if (preference) applyPreference(preference);
    else createBanner();

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-cookie-settings]")) openSettings();
    });

    window.wqConsent = {
      get: () => ({ ...(preference || emptyPreference) }),
      open: openSettings,
    };
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
  else initialize();
})();
