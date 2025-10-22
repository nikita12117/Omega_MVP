// GDPR cookie consent snippet for Aurora Codex MVP

// Consent categories
const consent = {
  necessary: true, // always enabled
  analytics: false,
  marketing: false
};

// Show banner (CZ)
function showCookieBannerCZ() {
  // Banner text
  alert("Tato stránka používá cookies pro zlepšení služeb. Nastavení můžete upravit nebo přijmout vše. Více v Zásadách ochrany osobních údajů.");
  // Granular toggles (simulate UI)
  // User sets consent.analytics and consent.marketing
}

// Show banner (EN)
function showCookieBannerEN() {
  alert("This site uses cookies to improve your experience. You can adjust settings or accept all. See our Privacy Policy for details.");
  // Granular toggles (simulate UI)
  // User sets consent.analytics and consent.marketing
}

// Consent event names
function onConsentGranted(category) {
  if (category === "analytics") {
    // e.g. send event: consent_granted_ga
    window.dataLayer.push({ event: "consent_granted_ga" });
    initAnalytics();
  }
  if (category === "marketing") {
    window.dataLayer.push({ event: "consent_granted_marketing" });
    initMarketing();
  }
}

function onConsentRevoked(category) {
  if (category === "analytics") {
    window.dataLayer.push({ event: "consent_revoked_ga" });
    blockAnalytics();
  }
  if (category === "marketing") {
    window.dataLayer.push({ event: "consent_revoked_marketing" });
    blockMarketing();
  }
}

// Store consent
function saveConsent() {
  localStorage.setItem('consent', JSON.stringify(consent));
}

// Block scripts until consent
function blockAnalytics() {
  // Remove/disable analytics scripts
}

function blockMarketing() {
  // Remove/disable marketing scripts
}

// Initialization
function initAnalytics() {
  // Load analytics scripts
}

function initMarketing() {
  // Load marketing scripts
}
