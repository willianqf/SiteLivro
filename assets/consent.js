(() => {
  const consentScriptUrl = document.currentScript?.src;
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
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
    ? new URL(isEnglish ? "../en/privacy/" : "../privacidade/", consentScriptUrl).href
    : isEnglish ? "/en/privacy/" : "/privacidade/";
  const t = isEnglish ? {
    preferences: "Your preferences",
    manage: "Manage cookies",
    intro: "Non-essential features remain disabled until you allow them.",
    necessary: "Necessary",
    necessaryDescription: "Privacy preference and essential website functions.",
    analytics: "Analytics",
    analyticsDescription: "Aggregated measurement of pages and interactions.",
    advertising: "Advertising",
    advertisingDescription: "Google Ads and AdSense for campaigns and ads.",
    rejectOptional: "Reject optional",
    save: "Save choices",
    close: "Close preferences",
    privacyControl: "Privacy under your control",
    choose: "You choose what to load",
    banner: "We use optional analytics and advertising features only with your permission.",
    learn: "Learn how it works.",
    reject: "Reject",
    accept: "Accept",
  } : {
    preferences: "Suas preferências",
    manage: "Gerenciar cookies",
    intro: "Recursos não essenciais permanecem desligados até sua autorização.",
    necessary: "Necessários",
    necessaryDescription: "Preferência de privacidade e funcionamento básico.",
    analytics: "Analíticos",
    analyticsDescription: "Medição agregada de páginas e interações.",
    advertising: "Publicidade",
    advertisingDescription: "Google Ads e AdSense para campanhas e anúncios.",
    rejectOptional: "Rejeitar opcionais",
    save: "Salvar escolhas",
    close: "Fechar preferências",
    privacyControl: "Privacidade sob seu controle",
    choose: "Você escolhe o que carregar",
    banner: "Usamos recursos opcionais de métricas e publicidade somente com sua autorização.",
    learn: "Entenda como funciona.",
    reject: "Rejeitar",
    accept: "Aceitar",
  };

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
          <div><span>${t.preferences}</span><h2 id="consent-settings-title">${t.manage}</h2></div>
          <button class="consent-close" value="cancel" aria-label="${t.close}">×</button>
        </div>
        <p>${t.intro}</p>
        <label class="consent-option is-required"><span><strong>${t.necessary}</strong><small>${t.necessaryDescription}</small></span><input type="checkbox" checked disabled></label>
        <label class="consent-option"><span><strong>${t.analytics}</strong><small>${t.analyticsDescription}</small></span><input type="checkbox" name="analytics"></label>
        <label class="consent-option"><span><strong>${t.advertising}</strong><small>${t.advertisingDescription}</small></span><input type="checkbox" name="marketing"></label>
        <div class="consent-dialog-actions">
          <button class="consent-button consent-secondary" type="button" data-consent-reject>${t.rejectOptional}</button>
          <button class="consent-button consent-primary" type="submit" value="save">${t.save}</button>
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
        <span>${t.privacyControl}</span>
        <h2 id="consent-title">${t.choose}</h2>
        <p>${t.banner} <a href="${privacyUrl}">${t.learn}</a></p>
      </div>
      <div class="consent-banner-actions">
        <button class="consent-button consent-secondary" type="button" data-consent-reject>${t.reject}</button>
        <button class="consent-button consent-secondary" type="button" data-consent-manage>${t.manage}</button>
        <button class="consent-button consent-primary" type="button" data-consent-accept>${t.accept}</button>
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
